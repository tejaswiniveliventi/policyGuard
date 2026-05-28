"""Alert management endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime
from src.core.database import get_db
from src.core.logger import get_logger
from src.models.orm import Alert, OrgConfig, AuditLog
from src.models.schemas import AlertResponse
from src.exceptions import NotFoundError

router = APIRouter(prefix="/api/alerts", tags=["alerts"])
logger = get_logger("policyguard.api.alerts")


class AlertAcknowledgeRequest(BaseModel):
    """Request to acknowledge an alert."""

    acknowledged_by: str
    action_taken: str = ""


@router.get("/{org_id}")
async def get_org_alerts(
    org_id: str, db: Session = Depends(get_db)
) -> List[AlertResponse]:
    """Get all alerts for organization."""
    logger.info(f"Fetching alerts for org: {org_id}")

    alerts = (
        db.query(Alert)
        .filter(Alert.org_id == org_id)
        .order_by(Alert.created_at.desc())
        .all()
    )

    return [AlertResponse.from_orm(a) for a in alerts]


@router.get("/{org_id}/{alert_id}")
async def get_alert(
    org_id: str, alert_id: str, db: Session = Depends(get_db)
) -> AlertResponse:
    """Get specific alert."""
    alert = (
        db.query(Alert)
        .filter(Alert.org_id == org_id, Alert.alert_id == alert_id)
        .first()
    )

    if not alert:
        raise NotFoundError("Alert", alert_id)

    return AlertResponse.from_orm(alert)


@router.put("/{org_id}/{alert_id}/acknowledge")
async def acknowledge_alert(
    org_id: str,
    alert_id: str,
    request: AlertAcknowledgeRequest,
    db: Session = Depends(get_db),
) -> AlertResponse:
    """Acknowledge an alert."""
    logger.info(f"Acknowledging alert {alert_id}")

    alert = (
        db.query(Alert)
        .filter(Alert.org_id == org_id, Alert.alert_id == alert_id)
        .first()
    )

    if not alert:
        raise NotFoundError("Alert", alert_id)

    # Update alert
    alert.status = "acknowledged"
    alert.acknowledged_at = datetime.utcnow()

    db.commit()
    db.refresh(alert)

    # Create audit log
    AuditLog.create_log(
        db=db,
        org_id=org_id,
        action="alert_acknowledged",
        actor=request.acknowledged_by,
        target_type="alert",
        target_id=alert_id,
        details={"action_taken": request.action_taken},
    )
    db.commit()

    logger.info(f"Alert {alert_id} acknowledged")

    return AlertResponse.from_orm(alert)


@router.put("/{org_id}/{alert_id}/dismiss")
async def dismiss_alert(
    org_id: str, alert_id: str, db: Session = Depends(get_db)
) -> AlertResponse:
    """Dismiss an alert."""
    logger.info(f"Dismissing alert {alert_id}")

    alert = (
        db.query(Alert)
        .filter(Alert.org_id == org_id, Alert.alert_id == alert_id)
        .first()
    )

    if not alert:
        raise NotFoundError("Alert", alert_id)

    # Update alert
    alert.status = "dismissed"

    db.commit()
    db.refresh(alert)

    logger.info(f"Alert {alert_id} dismissed")

    return AlertResponse.from_orm(alert)
