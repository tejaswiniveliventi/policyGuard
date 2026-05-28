# src/models/orm.py
"""
SQLAlchemy ORM models for database tables.
All data models defined here.
"""

from sqlalchemy import (
    Column,
    String,
    JSON,
    DateTime,
    Boolean,
    Float,
    Integer,
    Text,
    ForeignKey,
    Index,
)

# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime
import uuid

Base = declarative_base()


class OrgConfig(Base):
    __tablename__ = "org_configs"

    org_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    org_name = Column(String, nullable=False, unique=True)
    industry = Column(String)
    ai_use_cases = Column(JSON, default=list)
    contact_email = Column(String, nullable=False)
    slack_webhook_url = Column(String, nullable=True)
    notification_channels = Column(
        JSON, default=lambda: ["email", "slack", "dashboard"]
    )
    review_approval_required = Column(Boolean, default=True)

    # LLM override per org
    llm_provider_override = Column(String, nullable=True)
    llm_api_key_encrypted = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    policies = relationship(
        "Policy", back_populates="org", cascade="all, delete-orphan"
    )
    alerts = relationship("Alert", back_populates="org", cascade="all, delete-orphan")
    audit_logs = relationship(
        "AuditLog", back_populates="org", cascade="all, delete-orphan"
    )
    web_snapshots = relationship(
        "WebDataSnapshot", back_populates="org", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("idx_org_name", "org_name"),
        Index("idx_created_at", "created_at"),
    )


class Policy(Base):
    __tablename__ = "policies"

    policy_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    org_id = Column(String, ForeignKey("org_configs.org_id"), nullable=False)
    policy_type = Column(String)  # data_privacy, bias_fairness, security, transparency
    version = Column(Integer, default=1)
    status = Column(String, default="draft")  # draft, pending_review, approved, active
    content = Column(Text)  # Markdown content
    generated_from = Column(JSON, default=dict)
    review_comments = Column(JSON, default=list)
    reviewed_by = Column(String, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    # Relationship
    org = relationship("OrgConfig", back_populates="policies")
    alerts = relationship("Alert", back_populates="policy")

    __table_args__ = (
        Index("idx_org_id_policy_status", "org_id", "status"),
        Index("idx_policy_type", "policy_type"),
    )

    @classmethod
    def from_orm(cls, obj):
        """Convert ORM object to Pydantic schema."""
        if obj is None:
            return None
        return obj


class WebDataSnapshot(Base):
    __tablename__ = "web_data_snapshots"

    snapshot_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    org_id = Column(String, ForeignKey("org_configs.org_id"), nullable=False)
    data_type = Column(
        String
    )  # regulatory_update, threat_intelligence, industry_benchmark
    source = Column(String)
    content_summary = Column(String)
    full_content = Column(Text)
    bright_data_task_id = Column(String, nullable=True)
    relevance_score = Column(Float)
    requires_policy_update = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    org = relationship("OrgConfig", back_populates="web_snapshots")

    __table_args__ = (Index("idx_org_id_web_snapshot_created", "org_id", "created_at"),)


class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    org_id = Column(String, ForeignKey("org_configs.org_id"), nullable=False)
    policy_id = Column(String, ForeignKey("policies.policy_id"), nullable=True)
    alert_type = Column(String)
    severity = Column(String)  # low, medium, high, critical
    title = Column(String)
    description = Column(Text)
    source_data_snapshot = Column(String, nullable=True)
    recommended_action = Column(Text)
    status = Column(String, default="sent")  # sent, acknowledged, dismissed, acted_upon

    sent_at = Column(DateTime, default=datetime.utcnow)
    acknowledged_at = Column(DateTime, nullable=True)
    notified_via = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    org = relationship("OrgConfig", back_populates="alerts")
    policy = relationship("Policy", back_populates="alerts")

    __table_args__ = (
        Index("idx_org_id_alert_status", "org_id", "status"),
        Index("idx_severity", "severity"),
    )


class AuditLog(Base):
    __tablename__ = "audit_logs"

    log_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    org_id = Column(String, ForeignKey("org_configs.org_id"), nullable=False)
    action = Column(String)  # policy_approved, alert_triggered, etc.
    actor = Column(String)  # email or "System"
    target_type = Column(String, nullable=True)  # policy, alert, config
    target_id = Column(String, nullable=True)
    details = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    org = relationship("OrgConfig", back_populates="audit_logs")

    __table_args__ = (
        Index("idx_org_id_audit_created", "org_id", "created_at"),
        Index("idx_action", "action"),
    )
    # Inside the AuditLog class definition (at the end of the class)

    @classmethod
    def create_log(
        cls,
        db,
        org_id: str,
        action: str,
        actor: str,
        target_type: str = None,
        target_id: str = None,
        details: dict = None,
    ):
        """
        Helper method to create audit logs.

        Usage:
            AuditLog.create_log(
                db=db,
                org_id=org_id,
                action="policy_approved",
                actor="user@example.com",
                target_type="policy",
                target_id=policy.policy_id,
                details={"new_status": "active"}
            )
        """
        from datetime import datetime
        import uuid

        log = cls(
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
        return log
