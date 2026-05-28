# src/core/logger.py
"""
Centralized logging setup using YAML configuration.
All logging happens through this module.
"""

import logging
import logging.config
import yaml
import os
from pathlib import Path
from typing import Optional


class LoggerSetup:
    """Centralized logger configuration."""

    _logger: Optional[logging.Logger] = None
    _initialized = False

    @classmethod
    def initialize(cls, config_path: str = "utils/logging_config.yaml"):
        """Initialize logger from YAML config."""
        if cls._initialized:
            return

        config_file = Path(config_path)

        if not config_file.exists():
            # Fallback to basic config if YAML not found
            logging.basicConfig(
                level=logging.INFO,
                format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            )
            cls._logger = logging.getLogger("policyguard")
        else:
            with open(config_file) as f:
                config = yaml.safe_load(f)

            # Create log directory if it doesn't exist
            log_dir = Path(config.get("log_dir", "logs"))
            log_dir.mkdir(exist_ok=True)

            # Apply config
            logging.config.dictConfig(config["logging"])
            cls._logger = logging.getLogger("policyguard")

        cls._initialized = True
        cls._logger.info("Logger initialized")

    @classmethod
    def get_logger(cls, name: str = "policyguard") -> logging.Logger:
        """Get logger instance."""
        if not cls._initialized:
            cls.initialize()
        return logging.getLogger(name)


# Convenience function
def get_logger(name: str = "policyguard") -> logging.Logger:
    """Get a logger instance."""
    LoggerSetup.initialize()
    return LoggerSetup.get_logger(name)
