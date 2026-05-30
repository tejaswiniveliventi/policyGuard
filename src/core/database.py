# src/core/database.py
"""
Database connection and session management.
Supabase (managed Postgres) configuration.
"""

from sqlalchemy import text, create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import os
from src.core.logger import get_logger

logger = get_logger("policyguard.database")


class DatabaseManager:
    """Manage database connections."""

    _engine = None
    _session_local = None

    @classmethod
    def initialize(cls, database_url: str = None):
        """Initialize database connection."""
        if database_url is None:
            database_url = os.getenv("DATABASE_URL")

        if not database_url:
            raise ValueError("DATABASE_URL not set in environment")

        try:
            cls._engine = create_engine(
                database_url,
                echo=os.getenv("SQL_ECHO", "false").lower() == "true",
                pool_pre_ping=True,  # Test connections before using
                pool_size=5,
                max_overflow=10,
            )
            cls._session_local = sessionmaker(
                autocommit=False, autoflush=False, bind=cls._engine
            )

            # Test connection
            with cls._engine.connect() as conn:
                conn.execute(text("SELECT 1"))

            logger.info(
                f"Database connected: {database_url.split('@')[1] if '@' in database_url else 'Supabase'}"
            )
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            raise

    @classmethod
    def create_tables(cls):
        """Create database tables."""
        from src.models.orm import Base  # Import here to avoid circular imports
        if cls._engine is None:
            raise ValueError("Database not initialized")
        Base.metadata.create_all(bind=cls._engine)
        logger.info("Database tables created")

    @classmethod
    def get_session(cls) -> Session:
        """Get a database session."""
        if cls._session_local is None:
            cls.initialize()
        return cls._session_local()
        
    @classmethod
    def close(cls):
        """Close database connection."""
        if cls._engine:
            cls._engine.dispose()
            logger.info("Database connection closed")


def get_db() -> Generator[Session, None, None]:
    """Dependency for FastAPI to inject database session."""
    db = DatabaseManager.get_session()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database error: {e}")
        db.rollback()
        raise
    finally:
        db.close()
