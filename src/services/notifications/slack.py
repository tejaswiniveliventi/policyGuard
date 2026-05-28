"""Slack notification service."""

from typing import List, Dict, Any
from src.core.logger import get_logger
import requests
from src.exceptions import PolicyGuardException

logger = get_logger("policyguard.services.slack")


class SlackNotifier:
    """Send notifications to Slack via webhooks."""

    def __init__(self, webhook_url: str = None):
        """
        Initialize Slack notifier.

        Args:
            webhook_url: Slack incoming webhook URL
        """
        self.webhook_url = webhook_url
        if webhook_url:
            logger.info("Slack notifier initialized")
        else:
            logger.warning("Slack notifier: no webhook URL provided")

    def send_alert(
        self,
        title: str,
        description: str,
        severity: str = "medium",
        action_url: str = None,
        action_text: str = "Review in Dashboard",
    ) -> bool:
        """
        Send alert notification to Slack.

        Args:
            title: Alert title
            description: Alert description
            severity: Severity level (low, medium, high, critical)
            action_url: URL to click for action
            action_text: Text for action button

        Returns:
            True if sent successfully
        """
        if not self.webhook_url:
            logger.warning("Cannot send Slack notification: webhook not configured")
            return False

        try:
            # Color based on severity
            color_map = {
                "low": "#36a64f",  # Green
                "medium": "#ffb100",  # Orange
                "high": "#ff6b6b",  # Red
                "critical": "#8b0000",  # Dark Red
            }
            color = color_map.get(severity, "#808080")

            # Build message payload
            payload = {
                "attachments": [
                    {
                        "fallback": title,
                        "color": color,
                        "title": title,
                        "text": description,
                        "fields": [
                            {
                                "title": "Severity",
                                "value": severity.upper(),
                                "short": True,
                            }
                        ],
                    }
                ]
            }

            # Add action button if URL provided
            if action_url:
                payload["attachments"][0]["actions"] = [
                    {"type": "button", "text": action_text, "url": action_url}
                ]

            # Send to Slack
            response = requests.post(self.webhook_url, json=payload, timeout=10)

            if response.status_code == 200:
                logger.info(f"Slack notification sent: {title}")
                return True
            else:
                logger.error(f"Slack notification failed: {response.status_code}")
                return False

        except Exception as e:
            logger.error(f"Error sending Slack notification: {e}")
            return False

    def send_policy_alert(
        self,
        org_name: str,
        gap_count: int,
        validation_score: int,
        severity: str,
        policy_id: str,
        dashboard_url: str = "http://localhost:3000",
    ) -> bool:
        """
        Send a policy update alert to Slack.

        Args:
            org_name: Organization name
            gap_count: Number of gaps identified
            validation_score: Policy validation score (0-100)
            severity: Alert severity
            policy_id: Policy ID for reference
            dashboard_url: Base URL for action link

        Returns:
            True if sent successfully
        """
        title = f"🚨 Policy Update Needed: {org_name}"

        description = f"""
*{gap_count}* compliance gaps identified

*Validation Score:* {validation_score}/100
*Severity:* {severity.upper()}

A new AI policy draft has been generated and is ready for review.
        """.strip()

        action_url = f"{dashboard_url}/alerts/{policy_id}"

        return self.send_alert(
            title=title,
            description=description,
            severity=severity,
            action_url=action_url,
            action_text="Review Policy",
        )
