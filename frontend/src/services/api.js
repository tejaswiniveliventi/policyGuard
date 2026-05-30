/**
 * API Service - All backend communication
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Organization endpoints
  async createOrg(orgData) {
    return this.request('/api/org/config', {
      method: 'POST',
      body: JSON.stringify(orgData),
    });
  }

  async getOrg(orgId) {
    return this.request(`/api/org/config/${orgId}`);
  }

  async updateOrg(orgId, orgData) {
    return this.request(`/api/org/config/${orgId}`, {
      method: 'PUT',
      body: JSON.stringify(orgData),
    });
  }

  // Policy endpoints
  async triggerPolicyScan(orgId) {
    return this.request(`/api/policies/${orgId}/scan`, {
      method: 'POST',
    });
  }

  async getPolicies(orgId) {
    return this.request(`/api/policies/${orgId}`);
  }

  async getPolicy(orgId, policyId) {
    return this.request(`/api/policies/${orgId}/${policyId}`);
  }

  async updatePolicyStatus(orgId, policyId, status, reviewedBy, comments) {
    return this.request(`/api/policies/${orgId}/${policyId}`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        reviewed_by: reviewedBy,
        review_comments: comments,
      }),
    });
  }

  // Alert endpoints
  async getAlerts(orgId) {
    return this.request(`/api/alerts/${orgId}`);
  }

  async getAlert(orgId, alertId) {
    return this.request(`/api/alerts/${orgId}/${alertId}`);
  }

  async acknowledgeAlert(orgId, alertId, acknowledgedBy, actionTaken) {
    return this.request(`/api/alerts/${orgId}/${alertId}/acknowledge`, {
      method: 'PUT',
      body: JSON.stringify({
        acknowledged_by: acknowledgedBy,
        action_taken: actionTaken,
      }),
    });
  }

  async dismissAlert(orgId, alertId) {
    return this.request(`/api/alerts/${orgId}/${alertId}/dismiss`, {
      method: 'PUT',
    });
  }

  // Notification endpoints
  async getNotificationPreferences(orgId) {
    return this.request(`/api/notifications/${orgId}/preferences`);
  }

  async updateNotificationPreferences(orgId, channels, slackWebhook) {
    return this.request(`/api/notifications/${orgId}/preferences`, {
      method: 'PUT',
      body: JSON.stringify({
        notification_channels: channels,
        slack_webhook_url: slackWebhook,
      }),
    });
  }

  async testNotification(orgId, email, channels) {
    return this.request(`/api/notifications/${orgId}/test`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        channels,
      }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health/');
  }
}

export default new APIClient(); 