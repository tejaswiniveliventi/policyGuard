"""CrewAI Orchestrator - runs all agents in sequence."""

from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from src.core.logger import get_logger
from src.services.notifications.notification_service import notification_service
from src.agents.web_scraper_agent import WebScraperAgent
from src.agents.analyzer_agent import AnalyzerAgent
from src.agents.generator_agent import GeneratorAgent
from src.agents.validator_agent import ValidatorAgent
from src.agents.alerter_agent import AlerterAgent
from src.models.orm import OrgConfig, WebDataSnapshot, Policy, Alert, AuditLog
from src.exceptions import AgentError
from datetime import datetime
import uuid

logger = get_logger("policyguard.agents.orchestrator")


class CrewOrchestrator:
    """Orchestrates all 5 agents in sequence."""

    def __init__(self):
        """Initialize orchestrator with all agents."""
        self.web_scraper = WebScraperAgent()
        self.analyzer = AnalyzerAgent()
        self.generator = GeneratorAgent()
        self.validator = ValidatorAgent()
        self.alerter = AlerterAgent()

    def run_policy_scan(
        self, org_id: str, org_config: OrgConfig, current_policies: str, db: Session
    ) -> Dict[str, Any]:
        """
        Run complete policy scan workflow.

        Sequential execution:
        1. Web Scraper → Fetch web intelligence
        2. Analyzer → Identify gaps
        3. Generator → Create policy draft
        4. Validator → Validate quality
        5. Alerter → Route alert

        Args:
            org_id: Organization ID
            org_config: Organization configuration
            current_policies: Current org policies
            db: Database session

        Returns:
            Dict with complete workflow results
        """
        logger.info(f"Starting policy scan for org: {org_id}")

        try:
            # Step 1: Web Scraping
            logger.info("Step 1/5: Web Scraping")
            web_data = self.web_scraper.execute(
                org_id=org_id,
                industry=org_config.industry,
                ai_use_cases=org_config.ai_use_cases,
            )

            if web_data.get("status") != "success":
                raise AgentError(
                    f"Web scraper failed: {web_data.get('error')}",
                    agent_name="web_scraper",
                )

            # Store web data snapshots
            snapshots = self.web_scraper.create_snapshots(org_id, web_data)
            for snapshot in snapshots:
                db.add(snapshot)
            db.commit()
            logger.info(f"Stored {len(snapshots)} web data snapshots")

            # Step 2: Gap Analysis
            logger.info("Step 2/5: Gap Analysis")
            gaps = self.analyzer.execute(
                current_policies=current_policies, web_data=web_data
            )

            if gaps.get("status") != "success":
                raise AgentError(
                    f"Analyzer failed: {gaps.get('error')}", agent_name="analyzer"
                )

            logger.info(f"Identified {len(gaps.get('gaps', []))} compliance gaps")

            # Step 3: Policy Generation
            logger.info("Step 3/5: Policy Generation")
            policy_result = self.generator.execute(
                org_name=org_config.org_name,
                industry=org_config.industry,
                ai_use_cases=org_config.ai_use_cases,
                gaps=gaps,
                web_data=web_data,
            )

            if policy_result.get("status") != "success":
                raise AgentError(
                    f"Generator failed: {policy_result.get('error')}",
                    agent_name="generator",
                )

            policy_draft = policy_result.get("policy_draft", "")
            logger.info(f"Generated policy: {policy_result.get('word_count', 0)} words")

            # Step 4: Policy Validation
            logger.info("Step 4/5: Policy Validation")
            validation = self.validator.execute(policy_draft=policy_draft)

            if validation.get("status") != "success":
                raise AgentError(
                    f"Validator failed: {validation.get('error')}",
                    agent_name="validator",
                )

            logger.info(
                f"Policy validation score: {validation.get('validation_score', 0)}/100"
            )

            # Store policy in database
            policy = Policy(
                policy_id=str(uuid.uuid4()),
                org_id=org_id,
                policy_type="data_privacy",  # Could be dynamic
                version=1,
                status="pending_review"
                if org_config.review_approval_required
                else "active",
                content=policy_draft,
                generated_from={
                    "web_data_sources": list(web_data.keys()),
                    "gap_count": len(gaps.get("gaps", [])),
                    "model_used": "llama-3.1-8b-instant",
                },
            )
            db.add(policy)
            db.flush()
            logger.info(f"Stored policy: {policy.policy_id}")

            # Step 5: Alert Coordination
            logger.info("Step 5/5: Alert Coordination")
            alert_decision = self.alerter.execute(
                org_id=org_id,
                gaps=gaps,
                policy_draft=policy_draft,
                validation=validation,
                notification_channels=org_config.notification_channels,
            )

            if alert_decision.get("status") != "success":
                raise AgentError(
                    f"Alerter failed: {alert_decision.get('error')}",
                    agent_name="alerter",
                )

            # Create alert if needed
            alert = None
            if alert_decision.get("send_alert"):
                alert = Alert(
                    alert_id=str(uuid.uuid4()),
                    org_id=org_id,
                    policy_id=policy.policy_id
                    if alert_decision.get("send_alert")
                    else None,
                    alert_type="policy_update_needed",
                    severity=alert_decision.get("severity", "medium"),
                    title=alert_decision.get("title", "Policy Update Needed"),
                    description=alert_decision.get("description", ""),
                    recommended_action=alert_decision.get("recommended_action", ""),
                    status="sent",
                    notified_via=alert_decision.get("channels", []),
                )
                db.add(alert)
                db.flush()
                logger.info(f"Created alert: {alert.alert_id}")
            # Send notifications if alert created
            if alert_decision.get("send_alert"):
                try:
                    notif_results = notification_service.send_policy_alert(
                        org_id=org_id,
                        org_name=org_config.org_name,
                        contact_email=org_config.contact_email,
                        slack_webhook=org_config.slack_webhook_url,
                        notification_channels=org_config.notification_channels,
                        gap_count=len(gaps.get("gaps", [])),
                        validation_score=validation.get("validation_score", 0),
                        severity=alert_decision.get("severity", "medium"),
                        policy_draft=policy_draft[:500],  # First 500 chars
                        policy_id=policy.policy_id,
                    )
                    logger.info(f"Notifications sent: {notif_results}")
                except Exception as e:
                    logger.error(f"Error sending notifications: {e}")
            # Create audit log
            AuditLog.create_log(
                db=db,
                org_id=org_id,
                action="policy_scan_completed",
                actor="System",
                details={
                    "gaps_identified": len(gaps.get("gaps", [])),
                    "policy_id": policy.policy_id,
                    "validation_score": validation.get("validation_score", 0),
                    "alert_sent": alert_decision.get("send_alert", False),
                },
            )
            db.commit()

            logger.info(f"Policy scan completed for org: {org_id}")

            # Return complete result
            return {
                "org_id": org_id,
                "status": "completed",
                "web_data": web_data,
                "gaps": gaps,
                "policy": {
                    "policy_id": policy.policy_id,
                    "draft": policy_draft,
                    "word_count": policy_result.get("word_count", 0),
                },
                "validation": validation,
                "alert": alert_decision,
                "timestamp": datetime.utcnow().isoformat(),
            }

        except AgentError as e:
            logger.error(f"Agent error in policy scan: {e.message}")
            db.rollback()
            return {
                "org_id": org_id,
                "status": "error",
                "error": e.message,
                "error_code": e.error_code,
            }

        except Exception as e:
            logger.error(f"Unexpected error in policy scan: {e}", exc_info=True)
            db.rollback()
            return {"org_id": org_id, "status": "error", "error": str(e)}
