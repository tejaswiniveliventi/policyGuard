"""Policy management endpoints."""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime
from src.core.database import get_db
from src.core.logger import get_logger
from src.models.orm import Policy, OrgConfig, AuditLog
from src.models.schemas import PolicyResponse
from src.agents.crew_orchestrator import CrewOrchestrator
from src.exceptions import NotFoundError, ValidationError
import uuid

router = APIRouter(prefix="/api/policies", tags=["policies"])
logger = get_logger("policyguard.api.policies")

orchestrator = CrewOrchestrator()


class PolicyUpdateRequest(BaseModel):
    """Request to update policy status."""

    status: str  # draft, pending_review, approved, active
    reviewed_by: str
    review_comments: List[str] = []


@router.post("/{org_id}/scan")
async def trigger_policy_scan(
    org_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)
):
    """Trigger a policy scan for organization."""
    logger.info(f"Triggering policy scan for org: {org_id}")

    # Verify org exists
    org = db.query(OrgConfig).filter(OrgConfig.org_id == org_id).first()
    if not org:
        raise NotFoundError("Organization", org_id)

    # Get current policies
    current_policies_list = (
        db.query(Policy)
        .filter(Policy.org_id == org_id, Policy.status.in_(["approved", "active"]))
        .all()
    )

    current_policies_text = (
        "\n\n".join([f"# {p.policy_type}\n{p.content}" for p in current_policies_list])
        if current_policies_list
        else "No existing policies"
    )

    # Run scan in background
    def run_scan():
        try:
            result = orchestrator.run_policy_scan(
                org_id=org_id,
                org_config=org,
                current_policies=current_policies_text,
                db=db,
            )

            if result.get("status") == "error":
                logger.error(f"Policy scan error: {result.get('error')}")
            else:
                logger.info(f"Policy scan completed successfully for {org_id}")

        except Exception as e:
            logger.error(f"Background scan error: {e}", exc_info=True)

    # Add to background tasks
    background_tasks.add_task(run_scan)

    return {
        "status": "scan_started",
        "message": "Policy scan initiated in background",
        "org_id": org_id,
    }


@router.get("/{org_id}")
async def get_org_policies(
    org_id: str, db: Session = Depends(get_db)
) -> List[PolicyResponse]:
    """Get all policies for organization."""
    logger.info(f"Fetching policies for org: {org_id}")

    policies = db.query(Policy).filter(Policy.org_id == org_id).all()
    return [PolicyResponse.from_orm(p) for p in policies]


@router.get("/{org_id}/{policy_id}")
async def get_policy(
    org_id: str, policy_id: str, db: Session = Depends(get_db)
) -> PolicyResponse:
    """Get specific policy."""
    policy = (
        db.query(Policy)
        .filter(Policy.org_id == org_id, Policy.policy_id == policy_id)
        .first()
    )

    if not policy:
        raise NotFoundError("Policy", policy_id)

    return PolicyResponse.from_orm(policy)


@router.put("/{org_id}/{policy_id}")
async def update_policy_status(
    org_id: str,
    policy_id: str,
    update: PolicyUpdateRequest,
    db: Session = Depends(get_db),
) -> PolicyResponse:
    """Update policy status (approve, reject, etc)."""
    logger.info(f"Updating policy {policy_id} status to {update.status}")

    policy = (
        db.query(Policy)
        .filter(Policy.org_id == org_id, Policy.policy_id == policy_id)
        .first()
    )

    if not policy:
        raise NotFoundError("Policy", policy_id)

    # Update policy
    policy.status = update.status
    policy.reviewed_by = update.reviewed_by
    policy.reviewed_at = datetime.utcnow()
    policy.review_comments = update.review_comments

    db.commit()
    db.refresh(policy)

    # Create audit log
    AuditLog.create_log(
        db=db,
        org_id=org_id,
        action="policy_updated",
        actor=update.reviewed_by,
        target_type="policy",
        target_id=policy_id,
        details={"new_status": update.status, "comments": update.review_comments},
    )
    db.commit()

    logger.info(f"Policy {policy_id} updated to status: {update.status}")

    return PolicyResponse.from_orm(policy)
