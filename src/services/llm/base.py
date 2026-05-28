"""Abstract base class for LLM providers."""

from abc import ABC, abstractmethod
from src.core.logger import get_logger

logger = get_logger("policyguard.services.llm")


class BaseLLMProvider(ABC):
    """Abstract base for all LLM providers."""

    @abstractmethod
    def call(
        self, prompt: str, max_tokens: int = 2000, temperature: float = 0.0
    ) -> str:
        """Call LLM and return text response."""
        pass

    @abstractmethod
    def validate_connection(self) -> bool:
        """Test that API credentials work."""
        pass
