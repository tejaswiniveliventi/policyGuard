from src.config import AppConfig
from src.core.logger import get_logger

__version__ = AppConfig.APP_VERSION
logger = get_logger(__name__)
