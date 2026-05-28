"""Organization management endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.core.logger import get_logger
from src.models.orm import OrgConfig
from src.models.schemas import OrgConfigCreate, OrgConfigResponse
from src.exceptions import NotFoundError, ValidationError
import uuid

router = APIRouter(prefix="/api/org", tags=["organization"])
logger = get_logger("policyguard.api.org")


@router.post("/config", response_model=OrgConfigResponse)
async def create_org_config(config: OrgConfigCreate, db: Session = Depends(get_db)):
    """Create organization configuration."""
    try:
        logger.info(f"Creating org: {config.org_name}")

        # Check if org already exists
        existing = (
            db.query(OrgConfig).filter(OrgConfig.org_name == config.org_name).first()
        )

        if existing:
            raise ValidationError(
                f"Organization {config.org_name} already exists", field="org_name"
            )

        # Create org
        org = OrgConfig(
            org_id=str(uuid.uuid4()),
            org_name=config.org_name,
            industry=config.industry,
            ai_use_cases=config.ai_use_cases,
            contact_email=config.contact_email,
            slack_webhook_url=config.slack_webhook_url,
            notification_channels=config.notification_channels,
            review_approval_required=config.review_approval_required,
        )

        db.add(org)
        db.commit()
        db.refresh(org)

        logger.info(f"Organization created: {org.org_id}")
        return org

    except Exception as e:
        logger.error(f"Error creating org: {e}")
        db.rollback()
        raise


@router.get("/config/{org_id}", response_model=OrgConfigResponse)
async def get_org_config(org_id: str, db: Session = Depends(get_db)):
    """Get organization configuration."""
    org = db.query(OrgConfig).filter(OrgConfig.org_id == org_id).first()

    if not org:
        raise NotFoundError("Organization", org_id)

    return org


@router.put("/config/{org_id}", response_model=OrgConfigResponse)
async def update_org_config(
    org_id: str, config: OrgConfigCreate, db: Session = Depends(get_db)
):
    """Update organization configuration."""
    org = db.query(OrgConfig).filter(OrgConfig.org_id == org_id).first()

    if not org:
        raise NotFoundError("Organization", org_id)

    org.org_name = config.org_name
    org.industry = config.industry
    org.ai_use_cases = config.ai_use_cases
    org.contact_email = config.contact_email
    org.slack_webhook_url = config.slack_webhook_url
    org.notification_channels = config.notification_channels
    org.review_approval_required = config.review_approval_required

    db.commit()
    db.refresh(org)

    logger.info(f"Organization updated: {org_id}")
    return org
