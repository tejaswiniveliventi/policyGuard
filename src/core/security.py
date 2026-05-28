# src/core/security.py
"""
Security utilities: API key validation, auth, encryption.
"""

import os
from src.core.logger import get_logger

logger = get_logger("policyguard.security")


class SecurityManager:
    """Manage security concerns."""

    @staticmethod
    def validate_api_key(api_key: str, expected_key: str = None) -> bool:
        """Validate API key."""
        if expected_key is None:
            expected_key = os.getenv("API_KEY")

        if not expected_key:
            logger.warning("No API_KEY configured")
            return True  # Allow if not configured

        return api_key == expected_key

    @staticmethod
    def mask_sensitive_data(data: str, visible_chars: int = 4) -> str:
        """Mask API keys, passwords, etc. for logging."""
        if len(data) <= visible_chars:
            return "*" * len(data)
        return data[:visible_chars] + "*" * (len(data) - visible_chars)
