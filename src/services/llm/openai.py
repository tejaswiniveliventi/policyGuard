"""OpenAI API provider."""

from src.services.llm.base import BaseLLMProvider
from src.exceptions import LLMError
from src.core.logger import get_logger

logger = get_logger("policyguard.services.llm.openai")


class OpenAILLMProvider(BaseLLMProvider):
    """OpenAI LLM provider."""

    def __init__(self, api_key: str, model: str = "gpt-4"):
        try:
            from openai import OpenAI

            self.client = OpenAI(api_key=api_key)
            self.model = model
            logger.info(f"OpenAI provider initialized: {model}")
        except Exception as e:
            raise LLMError(f"Failed to initialize OpenAI: {e}", provider="openai")

    def call(
        self, prompt: str, max_tokens: int = 2000, temperature: float = 0.0
    ) -> str:
        """Call OpenAI API."""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=[{"role": "user", "content": prompt}],
            )
            return response.choices[0].message.content
        except Exception as e:
            raise LLMError(f"OpenAI API error: {e}", provider="openai")

    def validate_connection(self) -> bool:
        """Test OpenAI connection."""
        try:
            self.call("Hello", max_tokens=10)
            return True
        except:
            return False
