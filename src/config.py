# src/config.py
"""
Application configuration management.
All environment variables and config in one place.
"""

import os
from enum import Enum
from dotenv import load_dotenv
from src.core.logger import get_logger

# Load environment variables from .env file
load_dotenv()
logger = get_logger("policyguard.config")


class LLMProvider(str, Enum):
    """Supported LLM providers."""

    GROQ = "groq"
    TOGETHER = "together"
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    AZURE = "azure"


class AppConfig:
    """Application configuration."""

    # App settings
    APP_NAME = "PolicyGuard"
    APP_VERSION = "0.1.0"
    DEBUG = os.getenv("DEBUG", "false").lower() == "true"
    ENVIRONMENT = os.getenv(
        "ENVIRONMENT", "development"
    )  # development, staging, production

    # Database
    DATABASE_URL = os.getenv("DATABASE_URL")
    # print(f"Loaded DATABASE_URL: { os.getenv("DATABASE_URL")}")  # Debug statement
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is required")

    # FastAPI
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", 8000))
    API_KEY = os.getenv("API_KEY", "")  # Optional

    # LLM Configuration
    LLM_PROVIDER = os.getenv("LLM_PROVIDER", "groq").lower()
    LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
    LLM_TEMPERATURE = float(os.getenv("LLM_TEMPERATURE", "0.0"))
    LLM_MAX_TOKENS = int(os.getenv("LLM_MAX_TOKENS", "2000"))

    # LLM API Keys
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY", "")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
    AZURE_API_KEY = os.getenv("AZURE_API_KEY", "")
    AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT", "")

    # Web Intelligence
    BRIGHT_DATA_API_KEY = os.getenv("BRIGHT_DATA_API_KEY", "")

    # Notifications
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

    SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL", "")

    # Supabase Auth (for frontend)
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

    @classmethod
    def validate(cls):
        """Validate critical configuration."""
        logger.info(f"Environment: {cls.ENVIRONMENT}")
        logger.info(f"LLM Provider: {cls.LLM_PROVIDER}")

        # Validate LLM provider configuration
        if cls.LLM_PROVIDER == "groq" and not cls.GROQ_API_KEY:
            logger.warning("GROQ_API_KEY not set")
        elif cls.LLM_PROVIDER == "openai" and not cls.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY required for openai provider")
        # ... similar for others

    @classmethod
    def get_llm_config(cls) -> dict:
        """Get LLM configuration."""
        return {
            "provider": cls.LLM_PROVIDER,
            "model": cls.LLM_MODEL,
            "temperature": cls.LLM_TEMPERATURE,
            "max_tokens": cls.LLM_MAX_TOKENS,
            "groq_api_key": cls.GROQ_API_KEY,
            "together_api_key": cls.TOGETHER_API_KEY,
            "openai_api_key": cls.OPENAI_API_KEY,
            "anthropic_api_key": cls.ANTHROPIC_API_KEY,
            "azure_api_key": cls.AZURE_API_KEY,
            "azure_endpoint": cls.AZURE_ENDPOINT,
        }


# Validate on import
AppConfig.validate()
