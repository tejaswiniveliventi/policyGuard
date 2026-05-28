"""Policy management service."""

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from src.core.logger import get_logger
from src.models.orm import Policy, OrgConfig
from src.exceptions import NotFoundError, ValidationError
import uuid
from datetime import datetime

logger = get_logger("policyguard.services.policy")


class PolicyService:
    """Business logic for policy management."""

    @staticmethod
    def get_policy(org_id: str, policy_id: str, db: Session) -> Policy:
        """Get a specific policy."""
        policy = (
            db.query(Policy)
            .filter(Policy.org_id == org_id, Policy.policy_id == policy_id)
            .first()
        )

        if not policy:
            raise NotFoundError("Policy", policy_id)

        return policy

    @staticmethod
    def get_org_policies(org_id: str, db: Session, status: str = None) -> List[Policy]:
        """Get all policies for organization."""
        query = db.query(Policy).filter(Policy.org_id == org_id)

        if status:
            query = query.filter(Policy.status == status)

        return query.order_by(Policy.created_at.desc()).all()

    @staticmethod
    def approve_policy(
        org_id: str,
        policy_id: str,
        reviewed_by: str,
        review_comments: List[str],
        db: Session,
    ) -> Policy:
        """Approve a policy."""
        policy = PolicyService.get_policy(org_id, policy_id, db)

        if policy.status not in ["draft", "pending_review"]:
            raise ValidationError(f"Cannot approve policy in {policy.status} status")

        policy.status = "approved"
        policy.reviewed_by = reviewed_by
        policy.reviewed_at = datetime.utcnow()
        policy.review_comments = review_comments

        db.commit()
        db.refresh(policy)

        logger.info(f"Policy {policy_id} approved")
        return policy

    @staticmethod
    def reject_policy(
        org_id: str,
        policy_id: str,
        reviewed_by: str,
        review_comments: List[str],
        db: Session,
    ) -> Policy:
        """Reject a policy."""
        policy = PolicyService.get_policy(org_id, policy_id, db)

        policy.status = "draft"
        policy.reviewed_by = reviewed_by
        policy.reviewed_at = datetime.utcnow()
        policy.review_comments = review_comments

        db.commit()
        db.refresh(policy)

        logger.info(f"Policy {policy_id} rejected")
        return policy

    @staticmethod
    def activate_policy(org_id: str, policy_id: str, db: Session) -> Policy:
        """Activate an approved policy."""
        policy = PolicyService.get_policy(org_id, policy_id, db)

        if policy.status != "approved":
            raise ValidationError(f"Cannot activate policy in {policy.status} status")

        # Deactivate any other active policies of same type
        db.query(Policy).filter(
            Policy.org_id == org_id,
            Policy.policy_type == policy.policy_type,
            Policy.status == "active",
        ).update({"status": "approved"})

        policy.status = "active"
        db.commit()
        db.refresh(policy)

        logger.info(f"Policy {policy_id} activated")
        return policy
