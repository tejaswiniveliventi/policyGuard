/**
 * services/api.js
 * 
 * Centralized API client for all backend communication.
 * 
 * Handles:
 * - HTTP requests (GET, POST, PUT, DELETE)
 * - Error handling and response formatting
 * - Authentication headers
 * - Request/response interceptors
 * 
 * Base URL from environment: REACT_APP_API_URL
 */

import axios from 'axios';
import { getStoredToken, removeStoredToken } from './auth';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add auth token
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      removeStoredToken();
      window.location.href = '/signin';
    }
    throw error.response?.data || error.message;
  }
);

// ===== AUTHENTICATION =====
export const signIn = (email, password) =>
  apiClient.post('/api/auth/signin', { email, password });

export const signUp = (email, password, org_name) =>
  apiClient.post('/api/auth/signup', { email, password, org_name });

export const getUser = () => apiClient.get('/api/auth/user');

export const signOut = () => apiClient.post('/api/auth/signout');

// ===== ORGANIZATIONS =====
export const getOrganization = (orgId) =>
  apiClient.get(`/api/org/config/${orgId}`);

export const updateOrganization = (orgId, data) =>
  apiClient.put(`/api/org/config/${orgId}`, data);

// ===== DISCOVERY & ASSESSMENT =====
export const submitDiscovery = (orgId, discoveryData) =>
  apiClient.post(`/api/org/enterprise-discovery/${orgId}`, discoveryData);

export const getDiscoveryStatus = (orgId) =>
  apiClient.get(`/api/org/discovery-status/${orgId}`);

// ===== ASSESSMENTS =====
export const getAssessment = (assessmentId) =>
  apiClient.get(`/api/assessments/${assessmentId}`);

export const getAssessments = (orgId) =>
  apiClient.get(`/api/assessments`, { params: { org_id: orgId } });

export const runAssessment = (orgId) =>
  apiClient.post(`/api/assessments/run`, { org_id: orgId });

export const downloadAssessmentReport = (assessmentId) =>
  apiClient.get(`/api/assessments/${assessmentId}/report`, {
    responseType: 'blob',
  });

// ===== POLICIES =====
export const getPolicies = (orgId) =>
  apiClient.get(`/api/policies/${orgId}`);

export const getPolicy = (orgId, policyId) =>
  apiClient.get(`/api/policies/${orgId}/${policyId}`);

export const approvePolicy = (orgId, policyId, reviewData) =>
  apiClient.put(`/api/policies/${orgId}/${policyId}/approve`, reviewData);

export const rejectPolicy = (orgId, policyId, data) =>
  apiClient.put(`/api/policies/${orgId}/${policyId}/reject`, data);

export const updatePolicy = (orgId, policyId, data) =>
  apiClient.put(`/api/policies/${orgId}/${policyId}`, data);

export const downloadPolicy = (orgId, policyId) =>
  apiClient.get(`/api/policies/${orgId}/${policyId}/download`, {
    responseType: 'blob',
  });

// ===== ALERTS =====
export const getAlerts = (orgId) =>
  apiClient.get(`/api/alerts/${orgId}`);

export const getAlert = (orgId, alertId) =>
  apiClient.get(`/api/alerts/${orgId}/${alertId}`);

export const acknowledgeAlert = (orgId, alertId) =>
  apiClient.put(`/api/alerts/${orgId}/${alertId}/acknowledge`, {});

export const dismissAlert = (orgId, alertId) =>
  apiClient.put(`/api/alerts/${orgId}/${alertId}/dismiss`, {});

// ===== COMPLIANCE FRAMEWORKS =====
export const getComplianceFrameworks = (orgId) =>
  apiClient.get(`/api/compliance/frameworks/${orgId}`);

export const updateComplianceFramework = (orgId, framework, data) =>
  apiClient.put(`/api/compliance/frameworks/${orgId}/${framework}`, data);

// ===== AUDIT LOG =====
export const getAuditLog = (orgId, filters = {}) =>
  apiClient.get(`/api/audit/${orgId}`, { params: filters });

// ===== INTEGRATIONS (Settings) =====
export const getIntegrations = (orgId) =>
  apiClient.get(`/api/integrations/${orgId}`);

export const updateIntegration = (orgId, integrationId, data) =>
  apiClient.put(`/api/integrations/${orgId}/${integrationId}`, data);

export const testIntegration = (orgId, integrationId) =>
  apiClient.post(`/api/integrations/${orgId}/${integrationId}/test`, {});

// ===== TEAM MANAGEMENT =====
export const getTeamMembers = (orgId) =>
  apiClient.get(`/api/team/${orgId}`);

export const inviteTeamMember = (orgId, email, role) =>
  apiClient.post(`/api/team/${orgId}/invite`, { email, role });

export const removeTeamMember = (orgId, userId) =>
  apiClient.delete(`/api/team/${orgId}/${userId}`);

export const updateTeamMemberRole = (orgId, userId, role) =>
  apiClient.put(`/api/team/${orgId}/${userId}`, { role });

// ===== HEALTH CHECK =====
export const getHealth = () =>
  apiClient.get('/api/health');

// ===== EXPORT / DOWNLOAD =====
export const exportAssessment = (assessmentId, format = 'pdf') =>
  apiClient.get(`/api/assessments/${assessmentId}/export`, {
    params: { format },
    responseType: 'blob',
  });

export const exportPolicies = (orgId, format = 'pdf') =>
  apiClient.get(`/api/policies/${orgId}/export`, {
    params: { format },
    responseType: 'blob',
  });

/**
 * Helper function to handle file downloads
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
