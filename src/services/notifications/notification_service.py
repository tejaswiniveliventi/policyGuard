"""Unified notification service that routes to all channels."""

from typing import List, Dict, Any
from src.core.logger import get_logger
from src.services.notifications.slack import SlackNotifier
from src.services.notifications.email import EmailNotifier
from src.config import AppConfig

logger = get_logger("policyguard.services.notifications")


class NotificationService:
    """
    Unified notification service.

    Routes notifications to configured channels:
    - Email (SMTP)
    - Slack (Webhooks)
    - Dashboard (via database, real-time via Supabase)
    """

    def __init__(self):
        """Initialize notification service with all channels."""
        self.slack = SlackNotifier(webhook_url=AppConfig.SLACK_WEBHOOK_URL)
        self.email = EmailNotifier()
        self.logger = logger

    def send_policy_alert(
        self,
        org_id: str,
        org_name: str,
        contact_email: str,
        slack_webhook: str,
        notification_channels: List[str],
        gap_count: int,
        validation_score: int,
        severity: str,
        policy_draft: str,
        policy_id: str,
        dashboard_url: str = "http://localhost:3000",
    ) -> Dict[str, bool]:
        """
        Send policy alert to configured channels.

        Args:
            org_id: Organization ID
            org_name: Organization name
            contact_email: Contact email for org
            slack_webhook: Slack webhook for org (optional)
            notification_channels: List of channels to use ["email", "slack", "dashboard"]
            gap_count: Number of gaps identified
            validation_score: Policy validation score
            severity: Alert severity
            policy_draft: Policy draft text
            policy_id: Policy ID
            dashboard_url: Dashboard base URL

        Returns:
            Dict with success status for each channel
        """
        self.logger.info(
            f"Sending policy alert for {org_name} to channels: {notification_channels}"
        )

        results = {"email": False, "slack": False, "dashboard": False}

        # Email notification
        if "email" in notification_channels and contact_email:
            try:
                results["email"] = self.email.send_policy_alert(
                    to_email=contact_email,
                    org_name=org_name,
                    gap_count=gap_count,
                    validation_score=validation_score,
                    severity=severity,
                    policy_draft=policy_draft,
                    policy_id=policy_id,
                    dashboard_url=dashboard_url,
                )
            except Exception as e:
                self.logger.error(f"Error sending email notification: {e}")

        # Slack notification
        if "slack" in notification_channels and slack_webhook:
            try:
                slack_notifier = SlackNotifier(webhook_url=slack_webhook)
                results["slack"] = slack_notifier.send_policy_alert(
                    org_name=org_name,
                    gap_count=gap_count,
                    validation_score=validation_score,
                    severity=severity,
                    policy_id=policy_id,
                    dashboard_url=dashboard_url,
                )
            except Exception as e:
                self.logger.error(f"Error sending Slack notification: {e}")

        # Dashboard notification
        if "dashboard" in notification_channels:
            # Dashboard notifications are stored in the database (Alert table)
            # Real-time updates handled by Supabase subscriptions on frontend
            results["dashboard"] = True

        self.logger.info(f"Notifications sent for {org_id}: {results}")
        return results

    def send_test_notification(
        self, contact_email: str, slack_webhook: str, channels: List[str]
    ) -> Dict[str, bool]:
        """
        Send a test notification to verify configuration.

        Args:
            contact_email: Email to test
            slack_webhook: Slack webhook to test
            channels: Channels to test

        Returns:
            Dict with success status for each channel
        """
        self.logger.info(f"Sending test notifications to: {channels}")

        results = {}

        if "email" in channels:
            results["email"] = self.email.send_alert(
                to_email=contact_email,
                subject="PolicyGuard Test Notification",
                body_text="This is a test notification from PolicyGuard. If you received this, your email configuration is working correctly.",
                body_html="<p>This is a <strong>test notification</strong> from PolicyGuard. If you received this, your email configuration is working correctly.</p>",
            )

        if "slack" in channels and slack_webhook:
            slack_notifier = SlackNotifier(webhook_url=slack_webhook)
            results["slack"] = slack_notifier.send_alert(
                title="PolicyGuard Test Notification",
                description="This is a test notification from PolicyGuard. If you received this, your Slack webhook is configured correctly.",
                severity="low",
            )

        if "dashboard" in channels:
            results["dashboard"] = True

        return results


# Global instance
notification_service = NotificationService()
