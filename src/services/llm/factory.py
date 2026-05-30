"""Factory for creating LLM providers based on config."""

from src.config import AppConfig, LLMProvider
from src.services.llm.base import BaseLLMProvider
from src.services.llm.groq import GroqLLMProvider
from src.services.llm.openai import OpenAILLMProvider
from src.exceptions import ConfigurationError
from src.core.logger import get_logger

logger = get_logger("policyguard.services.llm.factory")


def get_llm_provider(config: dict = None) -> BaseLLMProvider:
    """Get LLM provider based on configuration."""

    if config is None:
        config = AppConfig.get_llm_config()

    provider_name = config.get("provider", AppConfig.LLM_PROVIDER).lower()

    logger.info(f"Creating LLM provider: {provider_name}")

    if provider_name == "groq":
        if not config.get("groq_api_key"):
            raise ConfigurationError("GROQ_API_KEY not configured")
        return GroqLLMProvider(
            api_key=config["groq_api_key"],
            model=config.get("model", "llama-3.1-8b-instant"),
        )

    elif provider_name == "openai":
        if not config.get("openai_api_key"):
            raise ConfigurationError("OPENAI_API_KEY not configured")
        return OpenAILLMProvider(
            api_key=config["openai_api_key"], model=config.get("model", "gpt-4")
        )

    else:
        raise ConfigurationError(f"Unknown LLM provider: {provider_name}")


# Global instance
llm_client = get_llm_provider()


def test_llm():
    """Test LLM connectivity."""
    try:
        is_valid = llm_client.validate_connection()
        if is_valid:
            logger.info("LLM provider connection valid")
        else:
            logger.warning("LLM provider connection failed")
        return is_valid
    except Exception as e:
        logger.error(f"LLM test failed: {e}")
        return False
