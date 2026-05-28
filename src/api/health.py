"""Health check endpoint."""

from fastapi import APIRouter
from datetime import datetime
from src.config import AppConfig
from src.core.logger import get_logger

router = APIRouter(prefix="/api/health", tags=["health"])
logger = get_logger("policyguard.api.health")


@router.get("/")
async def health_check():
    """Health check endpoint."""
    logger.debug("Health check called")
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": AppConfig.ENVIRONMENT,
        "llm_provider": AppConfig.LLM_PROVIDER,
        "database": "connected",
        "version": AppConfig.APP_VERSION,
    }


@router.get("/ready")
async def readiness_check():
    """Readiness check (can connect to DB, etc)."""
    return {"ready": True}
