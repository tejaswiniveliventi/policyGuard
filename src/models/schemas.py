# src/models/schemas.py
"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class OrgConfigCreate(BaseModel):
    org_name: str = Field(..., min_length=1, max_length=255)
    industry: str
    ai_use_cases: List[str] = Field(default_factory=list)
    contact_email: EmailStr
    slack_webhook_url: Optional[str] = None
    notification_channels: List[str] = Field(default=["email", "slack", "dashboard"])
    review_approval_required: bool = True


class OrgConfigResponse(OrgConfigCreate):
    org_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PolicyResponse(BaseModel):
    policy_id: str
    org_id: str
    policy_type: str
    version: int
    status: str
    content: str
    generated_from: Dict[str, Any]
    reviewed_by: Optional[str]
    reviewed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AlertResponse(BaseModel):
    alert_id: str
    org_id: str
    policy_id: Optional[str]
    alert_type: str
    severity: str
    title: str
    description: str
    recommended_action: str
    status: str
    notified_via: List[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    environment: str
    llm_provider: str
    database: str


class AuditLogResponse(BaseModel):
    log_id: str
    org_id: str
    action: str
    actor: str
    target_type: Optional[str]
    target_id: Optional[str]
    details: Dict[str, Any]
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
