# src/exceptions.py
"""
Custom exception classes for PolicyGuard.
Used for consistent error handling throughout the app.
"""

from typing import Optional, Dict, Any
from src.core.logger import get_logger

logger = get_logger("policyguard.exceptions")


class PolicyGuardException(Exception):
    """Base exception for all PolicyGuard errors."""

    def __init__(
        self,
        message: str,
        error_code: str = "POLICYGUARD_ERROR",
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None,
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}

        logger.error(f"{error_code}: {message}", extra={"details": self.details})
        super().__init__(self.message)


class ConfigurationError(PolicyGuardException):
    """Raised when configuration is invalid."""

    def __init__(self, message: str, details: Optional[Dict] = None):
        super().__init__(
            message=message, error_code="CONFIG_ERROR", status_code=500, details=details
        )


class DatabaseError(PolicyGuardException):
    """Raised when database operation fails."""

    def __init__(self, message: str, details: Optional[Dict] = None):
        super().__init__(
            message=message,
            error_code="DATABASE_ERROR",
            status_code=500,
            details=details,
        )


class LLMError(PolicyGuardException):
    """Raised when LLM call fails."""

    def __init__(
        self, message: str, provider: str = "", details: Optional[Dict] = None
    ):
        details = details or {}
        details["provider"] = provider
        super().__init__(
            message=message, error_code="LLM_ERROR", status_code=502, details=details
        )


class AgentError(PolicyGuardException):
    """Raised when agent execution fails."""

    def __init__(
        self, message: str, agent_name: str = "", details: Optional[Dict] = None
    ):
        details = details or {}
        details["agent"] = agent_name
        super().__init__(
            message=message, error_code="AGENT_ERROR", status_code=500, details=details
        )


class ValidationError(PolicyGuardException):
    """Raised when input validation fails."""

    def __init__(self, message: str, field: str = "", details: Optional[Dict] = None):
        details = details or {}
        details["field"] = field
        super().__init__(
            message=message,
            error_code="VALIDATION_ERROR",
            status_code=422,
            details=details,
        )


class NotFoundError(PolicyGuardException):
    """Raised when resource not found."""

    def __init__(
        self, resource: str, resource_id: str = "", details: Optional[Dict] = None
    ):
        details = details or {}
        details["resource"] = resource
        details["resource_id"] = resource_id
        super().__init__(
            message=f"{resource} not found",
            error_code="NOT_FOUND",
            status_code=404,
            details=details,
        )
