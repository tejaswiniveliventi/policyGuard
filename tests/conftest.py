"""
Pytest configuration and fixtures.
This sets up a test database and mocks external services.
"""

import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from src.models.orm import Base
from src.core.database import DatabaseManager, get_db
from src.config import AppConfig
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

# Use in-memory SQLite for tests
TEST_DATABASE_URL = "sqlite:///:memory:"


@pytest.fixture(scope="session")
def test_engine():
    """Create test database engine (in-memory SQLite)."""
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    # Create all tables
    Base.metadata.create_all(bind=engine)
    yield engine
    # Cleanup
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def test_db(test_engine):
    """Create a new database session for each test."""
    connection = test_engine.connect()
    transaction = connection.begin()
    session = sessionmaker(autocommit=False, autoflush=False, bind=connection)()

    yield session
    transaction.rollback()
    session.close()

    connection.close()


@pytest.fixture
def override_get_db(test_db):
    """Override FastAPI's get_db dependency."""

    def _override_get_db():
        try:
            yield test_db
        finally:
            pass

    return _override_get_db


@pytest.fixture
def client(test_db, override_get_db):
    """
    Create FastAPI TestClient with:
    - Mocked database (in-memory SQLite)
    - Mocked external services (LLM, Slack, Email)
    - Disabled startup/shutdown events
    """
    from src.main import app

    # Override the database dependency
    app.dependency_overrides[get_db] = override_get_db

    # Mock external services to prevent actual API calls
    with patch("src.services.llm.factory.llm_client") as mock_llm, patch(
        "src.services.notifications.notification_service.notification_service"
    ) as mock_notif, patch(
        "src.agents.crew_orchestrator.CrewOrchestrator"
    ) as mock_crew:
        # Configure mocks to return valid responses
        mock_llm.call.return_value = "Mock policy response"
        mock_notif.send_policy_alert.return_value = {
            "email": True,
            "slack": False,
            "dashboard": True,
        }

        yield TestClient(app)

    # Clean up overrides
    app.dependency_overrides.clear()


@pytest.fixture
def mock_llm():
    """Mock LLM provider for testing."""
    with patch("src.services.llm.factory.llm_client") as mock:
        mock.call.return_value = "Mock LLM response"
        mock.validate_connection.return_value = True
        yield mock


@pytest.fixture
def mock_notifications():
    """Mock notification service for testing."""
    with patch(
        "src.services.notifications.notification_service.notification_service"
    ) as mock:
        mock.send_policy_alert.return_value = {
            "email": True,
            "slack": True,
            "dashboard": True,
        }
        mock.send_test_notification.return_value = {
            "email": True,
            "slack": True,
            "dashboard": True,
        }
        yield mock


@pytest.fixture
def sample_org_data():
    """Sample organization data for tests."""
    return {
        "org_name": "Test Organization",
        "industry": "healthcare",
        "contact_email": "test@organization.com",
        "ai_use_cases": ["diagnosis", "scheduling"],
        "slack_webhook_url": "",
        "notification_channels": ["email", "dashboard"],
    }
