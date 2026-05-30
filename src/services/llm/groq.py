"""Groq API provider."""

from src.services.llm.base import BaseLLMProvider
from src.exceptions import LLMError
from src.core.logger import get_logger

logger = get_logger("policyguard.services.llm.groq")


class GroqLLMProvider(BaseLLMProvider):
    """Groq LLM provider."""

    def __init__(self, api_key: str, model: str = "mixtral-8x7b-32768"):
        try:
            from groq import Groq

            self.client = Groq(api_key=api_key)
            self.model = model
            logger.info(f"Groq provider initialized: {model}")
        except Exception as e:
            raise LLMError(f"Failed to initialize Groq: {e}", provider="groq")

    def call(
        self, prompt: str, max_tokens: int = 2000, temperature: float = 0.0
    ) -> str:
        """Call Groq API."""
        try:
            client_chat = self.client.chat.completions.create(
                messages=[
                    {"role": "user", "content": prompt}
                    ],
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
            
            )
            return client_chat.choices[0].message.content
        except Exception as e:
            raise LLMError(f"Groq API error: {e}", provider="groq")

    def validate_connection(self) -> bool:
        """Test Groq connection."""
        try:
            self.call("Hello", max_tokens=10)
            return True
        except:
            return False
