"""Base agent class for all CrewAI agents."""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from src.core.logger import get_logger

logger = get_logger("policyguard.agents.base")


class BaseAgent(ABC):
    """Abstract base class for all agents."""

    def __init__(self, name: str, role: str, goal: str):
        """
        Initialize agent with basic metadata.

        Args:
            name: Agent name (e.g., "web_scraper")
            role: Agent role (e.g., "Regulatory Intelligence Analyst")
            goal: Agent goal (e.g., "Fetch regulatory updates")
        """
        self.name = name
        self.role = role
        self.goal = goal
        self.logger = get_logger(f"policyguard.agents.{name}")

    @abstractmethod
    def execute(self, **kwargs) -> Dict[str, Any]:
        """
        Execute the agent's main task.

        Must be implemented by subclasses.
        Returns a dict with results.
        """
        pass

    def log_start(self, task_name: str, **context):
        """Log agent task start."""
        self.logger.info(f"Starting {task_name}", extra={"context": context})

    def log_end(self, task_name: str, status: str = "completed", **context):
        """Log agent task completion."""
        self.logger.info(f"Task {task_name} {status}", extra={"context": context})

    def log_error(self, task_name: str, error: Exception):
        """Log agent error."""
        self.logger.error(f"Error in {task_name}: {error}", exc_info=True)
