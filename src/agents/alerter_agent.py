"""Alert Coordinator Agent - decides alert routing and severity."""

from typing import Dict, Any, List
from src.agents.base_agent import BaseAgent
from datetime import datetime


class AlerterAgent(BaseAgent):
    """
    Alert Coordinator Agent

    Decides what alerts to send, which channels to use, and message content.
    Routes alerts based on organization preferences and severity.
    """

    def __init__(self):
        """Initialize Alerter Agent."""
        super().__init__(
            name="alerter",
            role="Alert Manager",
            goal="Determine what alerts to send and route to appropriate channels",
        )

    def execute(
        self,
        org_id: str,
        gaps: Dict[str, Any],
        policy_draft: str,
        validation: Dict[str, Any],
        notification_channels: List[str],
        **kwargs,
    ) -> Dict[str, Any]:
        """
        Determine alert routing and content.

        Args:
            org_id: Organization ID
            gaps: Identified gaps
            policy_draft: Generated policy
            validation: Validation results
            notification_channels: Preferred channels (email, slack, dashboard)

        Returns:
            Dict with alert details and routing
        """
        self.log_start("alert_coordination", org_id=org_id)

        try:
            # Determine if alert should be sent
            should_alert = self._should_send_alert(gaps, validation)

            if not should_alert:
                return {
                    "status": "success",
                    "send_alert": False,
                    "reason": "No critical issues detected",
                }

            # Determine severity
            severity = self._determine_severity(gaps)

            # Create alert content
            alert = {
                "send_alert": True,
                "org_id": org_id,
                "severity": severity,
                "channels": notification_channels,
                "title": self._generate_title(gaps),
                "description": self._generate_description(gaps, validation),
                "recommended_action": "Review and approve new policy draft",
                "policy_draft_attached": True,
                "created_at": datetime.utcnow().isoformat(),
            }

            self.log_end(
                "alert_coordination",
                status="completed",
                severity=severity,
                channels=notification_channels,
            )
            return alert

        except Exception as e:
            self.log_error("alert_coordination", e)
            return {"status": "error", "send_alert": False, "error": str(e)}

    def _should_send_alert(
        self, gaps: Dict[str, Any], validation: Dict[str, Any]
    ) -> bool:
        """Determine if alert should be sent."""
        # Send if there are critical gaps or validation issues
        has_critical_gaps = any(
            g.get("severity") == "critical" for g in gaps.get("gaps", [])
        )
        has_validation_issues = len(validation.get("issues", [])) > 0

        return has_critical_gaps or has_validation_issues

    def _determine_severity(self, gaps: Dict[str, Any]) -> str:
        """Determine alert severity."""
        gap_list = gaps.get("gaps", [])

        if any(g.get("severity") == "critical" for g in gap_list):
            return "critical"
        elif any(g.get("severity") == "high" for g in gap_list):
            return "high"
        elif any(g.get("severity") == "medium" for g in gap_list):
            return "medium"
        else:
            return "low"

    def _generate_title(self, gaps: Dict[str, Any]) -> str:
        """Generate alert title."""
        gap_count = len(gaps.get("gaps", []))
        return f"AI Policy Update Required: {gap_count} Compliance Gap{'s' if gap_count != 1 else ''} Identified"

    def _generate_description(
        self, gaps: Dict[str, Any], validation: Dict[str, Any]
    ) -> str:
        """Generate alert description."""
        gap_list = gaps.get("gaps", [])

        top_gaps = gap_list[:3]
        description = (
            "New regulatory updates and compliance requirements have been detected:\n\n"
        )

        for i, gap in enumerate(top_gaps, 1):
            description += f"{i}. [{gap.get('severity', 'medium').upper()}] {gap.get('gap_type', 'Unknown Gap')}\n"
            description += f"   {gap.get('description', '')}\n\n"

        validation_score = validation.get("validation_score", 0)
        description += f"\nGenerated policy validation score: {validation_score}/100\n"

        if validation_score >= 90:
            description += "Status: Ready for immediate review\n"
        elif validation_score >= 70:
            description += "Status: Ready with minor clarifications\n"
        else:
            description += "Status: Needs further refinement\n"

        return description
