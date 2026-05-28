"""Audit logging service."""

from typing import Dict, Any
from sqlalchemy.orm import Session
from src.core.logger import get_logger
from src.models.orm import AuditLog
from datetime import datetime
import uuid

logger = get_logger("policyguard.services.audit")


class AuditService:
    """Service for audit logging."""

    @staticmethod
    def log_action(
        db: Session,
        org_id: str,
        action: str,
        actor: str,
        target_type: str = None,
        target_id: str = None,
        details: Dict[str, Any] = None,
    ) -> AuditLog:
        """Create an audit log entry."""
        log = AuditLog(
            log_id=str(uuid.uuid4()),
            org_id=org_id,
            action=action,
            actor=actor,
            target_type=target_type,
            target_id=target_id,
            details=details or {},
            created_at=datetime.utcnow(),
        )

        db.add(log)
        db.commit()
        db.refresh(log)

        logger.info(f"Audit: {action} by {actor} on {target_type}/{target_id}")
        return log

    @staticmethod
    def get_org_audit_log(org_id: str, db: Session, limit: int = 100):
        """Get audit log for organization."""
        logs = (
            db.query(AuditLog)
            .filter(AuditLog.org_id == org_id)
            .order_by(AuditLog.created_at.desc())
            .limit(limit)
            .all()
        )

        return logs
