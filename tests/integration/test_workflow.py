"""Integration tests for PolicyGuard workflow."""

import pytest
from datetime import datetime


class TestOrganizationWorkflow:
    """Test organization creation and management."""

    def test_create_org(self, client, sample_org_data):
        """Test creating an organization."""
        response = client.post("/api/org/config", json=sample_org_data)

        assert response.status_code == 200
        data = response.json()
        assert data["org_name"] == sample_org_data["org_name"]
        assert data["industry"] == sample_org_data["industry"]
        assert "org_id" in data
        assert "created_at" in data

    def test_create_org_duplicate_name(self, client, sample_org_data):
        """Test that duplicate org names are rejected."""
        # Create first org
        response1 = client.post("/api/org/config", json=sample_org_data)
        assert response1.status_code == 200

        # Try to create duplicate
        response2 = client.post("/api/org/config", json=sample_org_data)
        # Should fail due to unique constraint
        assert response2.status_code in [422, 500]  # Validation or database error

    def test_get_org(self, client, sample_org_data):
        """Test getting organization config."""
        # Create org
        create_response = client.post("/api/org/config", json=sample_org_data)
        org_id = create_response.json()["org_id"]

        # Get org
        get_response = client.get(f"/api/org/config/{org_id}")
        assert get_response.status_code == 200
        data = get_response.json()
        assert data["org_id"] == org_id
        assert data["org_name"] == sample_org_data["org_name"]

    def test_get_nonexistent_org(self, client):
        """Test getting nonexistent organization."""
        response = client.get("/api/org/config/nonexistent-id")
        assert response.status_code == 404

    def test_update_org(self, client, sample_org_data):
        """Test updating organization config."""
        # Create org
        create_response = client.post("/api/org/config", json=sample_org_data)
        org_id = create_response.json()["org_id"]

        # Update org
        updated_data = sample_org_data.copy()
        updated_data["org_name"] = "Updated Organization"
        updated_data["industry"] = "education"

        update_response = client.put(f"/api/org/config/{org_id}", json=updated_data)
        assert update_response.status_code == 200

        data = update_response.json()
        assert data["org_name"] == "Updated Organization"
        assert data["industry"] == "education"


class TestHealthCheck:
    """Test health check endpoints."""

    def test_health_check(self, client):
        """Test /api/health endpoint."""
        response = client.get("/api/health/")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "timestamp" in data
        assert "environment" in data
        assert "llm_provider" in data
        assert "database" in data

    def test_health_readiness(self, client):
        """Test /api/health/ready endpoint."""
        response = client.get("/api/health/ready")

        assert response.status_code == 200
        data = response.json()
        assert data["ready"] is True


class TestPolicyEndpoints:
    """Test policy management endpoints."""

    def test_get_org_policies_empty(self, client, sample_org_data):
        """Test getting policies for new org."""
        # Create org
        create_response = client.post("/api/org/config", json=sample_org_data)
        org_id = create_response.json()["org_id"]

        # Get policies (should be empty)
        response = client.get(f"/api/policies/{org_id}")
        assert response.status_code == 200
        policies = response.json()
        assert isinstance(policies, list)
        assert len(policies) == 0

    def test_trigger_policy_scan(
        self, client, sample_org_data, mock_llm, mock_notifications
    ):
        """Test triggering a policy scan."""
        # Create org
        create_response = client.post("/api/org/config", json=sample_org_data)
        org_id = create_response.json()["org_id"]

        # Trigger scan
        response = client.post(f"/api/policies/{org_id}/scan")

        # Should return immediately (background task)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "scan_started"
        assert data["org_id"] == org_id

    def test_get_nonexistent_policy(self, client, sample_org_data):
        """Test getting nonexistent policy."""
        # Create org
        create_response = client.post("/api/org/config", json=sample_org_data)
        org_id = create_response.json()["org_id"]

        # Get nonexistent policy
        response = client.get(f"/api/policies/{org_id}/nonexistent-policy-id")
        assert response.status_code == 404


class TestAlertEndpoints:
    """Test alert management endpoints."""

    def test_get_org_alerts_empty(self, client, sample_org_data):
        """Test getting alerts for new org."""
        # Create org
        create_response = client.post("/api/org/config", json=sample_org_data)
        org_id = create_response.json()["org_id"]

        # Get alerts (should be empty)
        response = client.get(f"/api/alerts/{org_id}")
        assert response.status_code == 200
        alerts = response.json()
        assert isinstance(alerts, list)
        assert len(alerts) == 0

    def test_get_nonexistent_alert(self, client, sample_org_data):
        """Test getting nonexistent alert."""
        # Create org
        create_response = client.post("/api/org/config", json=sample_org_data)
        org_id = create_response.json()["org_id"]

        # Get nonexistent alert
        response = client.get(f"/api/alerts/{org_id}/nonexistent-alert-id")
        assert response.status_code == 404


class TestNotificationEndpoints:
    """Test notification management endpoints."""

    def test_get_notification_preferences(self, client, sample_org_data):
        """Test getting notification preferences."""
        # Create org
        create_response = client.post("/api/org/config", json=sample_org_data)
        org_id = create_response.json()["org_id"]

        # Get preferences
        response = client.get(f"/api/notifications/{org_id}/preferences")
        assert response.status_code == 200
        data = response.json()
        assert "notification_channels" in data
        assert "contact_email" in data

    def test_update_notification_preferences(self, client, sample_org_data):
        """Test updating notification preferences."""
        # Create org
        create_response = client.post("/api/org/config", json=sample_org_data)
        org_id = create_response.json()["org_id"]

        # Update preferences
        response = client.put(
            f"/api/notifications/{org_id}/preferences",
            json={
                "notification_channels": ["email", "dashboard"],
                "slack_webhook_url": "",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"

    def test_test_notification(self, client, sample_org_data, mock_notifications):
        """Test sending test notification."""
        # Create org
        create_response = client.post("/api/org/config", json=sample_org_data)
        org_id = create_response.json()["org_id"]

        # Send test notification
        response = client.post(
            f"/api/notifications/{org_id}/test",
            json={"email": "test@example.com", "channels": ["dashboard"]},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "results" in data


class TestRootEndpoint:
    """Test root endpoint."""

    def test_root(self, client):
        """Test GET / endpoint."""
        response = client.get("/")

        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "version" in data
        assert "docs" in data
