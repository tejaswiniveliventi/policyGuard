"""Email notification service."""

from typing import List, Dict, Any
from src.core.logger import get_logger
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from src.config import AppConfig

logger = get_logger("policyguard.services.email")


class EmailNotifier:
    """Send notifications via email (SMTP)."""

    def __init__(
        self,
        smtp_server: str = None,
        smtp_port: int = None,
        smtp_user: str = None,
        smtp_password: str = None,
    ):
        """
        Initialize email notifier.

        Args:
            smtp_server: SMTP server hostname
            smtp_port: SMTP port (usually 587 for TLS)
            smtp_user: SMTP username (usually email address)
            smtp_password: SMTP password or app password
        """
        self.smtp_server = smtp_server or AppConfig.SMTP_SERVER
        self.smtp_port = smtp_port or AppConfig.SMTP_PORT
        self.smtp_user = smtp_user or AppConfig.SMTP_USER
        self.smtp_password = smtp_password or AppConfig.SMTP_PASSWORD

        if self.smtp_user:
            logger.info(
                f"Email notifier initialized: {self.smtp_server}:{self.smtp_port}"
            )
        else:
            logger.warning("Email notifier: credentials not configured")

    def send_alert(
        self,
        to_email: str,
        subject: str,
        body_text: str,
        body_html: str = None,
        org_name: str = "PolicyGuard",
    ) -> bool:
        """
        Send email notification.

        Args:
            to_email: Recipient email address
            subject: Email subject
            body_text: Plain text body
            body_html: HTML body (optional)
            org_name: Organization name for footer

        Returns:
            True if sent successfully
        """
        if not self.smtp_user or not self.smtp_password:
            logger.warning("Cannot send email: credentials not configured")
            return False

        try:
            # Create message
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.smtp_user
            msg["To"] = to_email

            # Add text part
            msg.attach(MIMEText(body_text, "plain"))

            # Add HTML part if provided
            if body_html:
                msg.attach(MIMEText(body_html, "html"))

            # Connect and send
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)

            logger.info(f"Email sent to {to_email}: {subject}")
            return True

        except smtplib.SMTPAuthenticationError:
            logger.error("Email authentication failed - check credentials")
            return False
        except Exception as e:
            logger.error(f"Error sending email: {e}")
            return False

    def send_policy_alert(
        self,
        to_email: str,
        org_name: str,
        gap_count: int,
        validation_score: int,
        severity: str,
        policy_draft: str,
        policy_id: str,
        dashboard_url: str = "http://localhost:3000",
    ) -> bool:
        """
        Send a policy update alert via email.

        Args:
            to_email: Recipient email
            org_name: Organization name
            gap_count: Number of gaps
            validation_score: Policy score (0-100)
            severity: Alert severity
            policy_draft: Policy draft text
            policy_id: Policy ID
            dashboard_url: Dashboard URL

        Returns:
            True if sent successfully
        """
        subject = f"Policy Update Required: {gap_count} Compliance Gap{'s' if gap_count != 1 else ''} Identified"

        # Plain text version
        body_text = f"""
Hello,

PolicyGuard has identified {gap_count} compliance gaps and generated a new AI policy draft for {org_name}.

DETAILS:
- Severity: {severity.upper()}
- Validation Score: {validation_score}/100
- Policy ID: {policy_id}

POLICY DRAFT:
{policy_draft[:1000]}...

NEXT STEPS:
1. Log into the dashboard: {dashboard_url}
2. Review the complete policy draft
3. Add comments or request changes
4. Approve or reject the policy

The policy will not be activated until you approve it.

---
PolicyGuard - Privacy-First AI Policy Framework
        """.strip()

        # HTML version
        body_html = f"""
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2c3e50;">Policy Update Required</h1>
      
      <p>Hello,</p>
      
      <p>PolicyGuard has identified <strong>{gap_count} compliance gaps</strong> and generated a new AI policy draft for <strong>{org_name}</strong>.</p>
      
      <h2 style="color: #2c3e50;">Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ecf0f1; font-weight: bold;">Severity</td>
          <td style="padding: 8px; border-bottom: 1px solid #ecf0f1;">{severity.upper()}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ecf0f1; font-weight: bold;">Validation Score</td>
          <td style="padding: 8px; border-bottom: 1px solid #ecf0f1;">{validation_score}/100</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ecf0f1; font-weight: bold;">Policy ID</td>
          <td style="padding: 8px; border-bottom: 1px solid #ecf0f1;"><code>{policy_id}</code></td>
        </tr>
      </table>
      
      <h2 style="color: #2c3e50;">Next Steps</h2>
      <ol>
        <li>Log into the <a href="{dashboard_url}" style="color: #3498db;">PolicyGuard dashboard</a></li>
        <li>Review the complete policy draft</li>
        <li>Add comments or request changes</li>
        <li>Approve or reject the policy</li>
      </ol>
      
      <p style="background: #ecf0f1; padding: 12px; border-radius: 4px; margin-top: 20px;">
        <strong>Note:</strong> The policy will not be activated until you approve it.
      </p>
      
      <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 20px 0;">
      
      <p style="color: #7f8c8d; font-size: 12px;">
        PolicyGuard - Privacy-First AI Policy Framework<br>
        <a href="http://localhost:3000" style="color: #3498db;">Visit Dashboard</a>
      </p>
    </div>
  </body>
</html>
        """

        return self.send_alert(
            to_email=to_email,
            subject=subject,
            body_text=body_text,
            body_html=body_html,
            org_name=org_name,
        )
