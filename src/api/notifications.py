"""Notification management endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List
from src.core.logger import get_logger
from src.services.notifications.notification_service import notification_service
from src.core.database import get_db
from sqlalchemy.orm import Session
from src.models.orm import OrgConfig
from src.exceptions import NotFoundError, ValidationError

router = APIRouter(prefix="/api/notifications", tags=["notifications"])
logger = get_logger("policyguard.api.notifications")


class TestNotificationRequest(BaseModel):
    """Request to send test notification."""

    email: EmailStr
    channels: List[str] = ["email"]  # email, slack, dashboard


class NotificationPreferencesRequest(BaseModel):
    """Update notification preferences."""

    notification_channels: List[str]
    slack_webhook_url: str = ""


@router.post("/{org_id}/test")
async def test_notification(
    org_id: str, request: TestNotificationRequest, db: Session = Depends(get_db)
):
    """
    Send test notification to verify configuration.

    Useful for testing email/Slack before deploying.
    """
    logger.info(f"Sending test notification for org: {org_id}")

    # Verify org exists
    org = db.query(OrgConfig).filter(OrgConfig.org_id == org_id).first()
    if not org:
        raise NotFoundError("Organization", org_id)

    try:
        results = notification_service.send_test_notification(
            contact_email=request.email,
            slack_webhook=org.slack_webhook_url if "slack" in request.channels else "",
            channels=request.channels,
        )

        return {
            "status": "success",
            "message": "Test notifications sent",
            "results": results,
        }

    except Exception as e:
        logger.error(f"Error sending test notification: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to send test notification: {str(e)}"
        )


@router.get("/{org_id}/preferences")
async def get_notification_preferences(org_id: str, db: Session = Depends(get_db)):
    """Get organization's notification preferences."""
    org = db.query(OrgConfig).filter(OrgConfig.org_id == org_id).first()

    if not org:
        raise NotFoundError("Organization", org_id)

    return {
        "notification_channels": org.notification_channels,
        "slack_webhook_url": "***" if org.slack_webhook_url else None,
        "contact_email": org.contact_email,
    }


@router.put("/{org_id}/preferences")
async def update_notification_preferences(
    org_id: str,
    preferences: NotificationPreferencesRequest,
    db: Session = Depends(get_db),
):
    """Update organization's notification preferences."""
    logger.info(f"Updating notification preferences for org: {org_id}")

    org = db.query(OrgConfig).filter(OrgConfig.org_id == org_id).first()

    if not org:
        raise NotFoundError("Organization", org_id)

    # Validate channels
    valid_channels = ["email", "slack", "dashboard"]
    invalid = [c for c in preferences.notification_channels if c not in valid_channels]
    if invalid:
        raise ValidationError(f"Invalid channels: {invalid}")

    # Update preferences
    org.notification_channels = preferences.notification_channels
    if preferences.slack_webhook_url:
        org.slack_webhook_url = preferences.slack_webhook_url

    db.commit()
    db.refresh(org)

    return {
        "status": "success",
        "message": "Preferences updated",
        "notification_channels": org.notification_channels,
    }
