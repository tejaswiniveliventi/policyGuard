"""Organization management service."""

from typing import Dict, Any, List
from sqlalchemy.orm import Session
from src.core.logger import get_logger
from src.models.orm import OrgConfig, Policy, Alert
from src.exceptions import NotFoundError, ValidationError
from datetime import datetime

logger = get_logger("policyguard.services.org")


class OrgService:
    """Business logic for organization management."""

    @staticmethod
    def get_org(org_id: str, db: Session) -> OrgConfig:
        """Get organization config."""
        org = db.query(OrgConfig).filter(OrgConfig.org_id == org_id).first()

        if not org:
            raise NotFoundError("Organization", org_id)

        return org

    @staticmethod
    def update_org(
        org_id: str,
        org_name: str,
        industry: str,
        ai_use_cases: List[str],
        contact_email: str,
        slack_webhook_url: str,
        notification_channels: List[str],
        db: Session,
    ) -> OrgConfig:
        """Update organization configuration."""
        org = OrgService.get_org(org_id, db)

        org.org_name = org_name
        org.industry = industry
        org.ai_use_cases = ai_use_cases
        org.contact_email = contact_email
        org.slack_webhook_url = slack_webhook_url
        org.notification_channels = notification_channels
        org.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(org)

        logger.info(f"Organization {org_id} updated")
        return org

    @staticmethod
    def get_org_summary(org_id: str, db: Session) -> Dict[str, Any]:
        """Get summary statistics for organization."""
        org = OrgService.get_org(org_id, db)

        # Count policies by status
        total_policies = db.query(Policy).filter(Policy.org_id == org_id).count()
        active_policies = (
            db.query(Policy)
            .filter(Policy.org_id == org_id, Policy.status == "active")
            .count()
        )
        pending_review = (
            db.query(Policy)
            .filter(Policy.org_id == org_id, Policy.status == "pending_review")
            .count()
        )

        # Count alerts
        total_alerts = db.query(Alert).filter(Alert.org_id == org_id).count()
        open_alerts = (
            db.query(Alert)
            .filter(Alert.org_id == org_id, Alert.status.in_(["sent", "acknowledged"]))
            .count()
        )

        return {
            "org_id": org_id,
            "org_name": org.org_name,
            "industry": org.industry,
            "policies": {
                "total": total_policies,
                "active": active_policies,
                "pending_review": pending_review,
            },
            "alerts": {"total": total_alerts, "open": open_alerts},
            "created_at": org.created_at.isoformat() if org.created_at else None,
            "last_scan": None,  # Could add from latest Alert/Policy
        }
