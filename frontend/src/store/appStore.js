/**
 * store/appStore.js
 * 
 * Global application state management using Zustand.
 * 
 * Manages:
 * - User authentication state
 * - Organization data
 * - Assessment results
 * - Policies and alerts
 * - Loading/error states
 * 
 * Used throughout the app via useAppStore() hook.
 */

import {create} from 'zustand';
import * as api from '../services/api';
import { getStoredToken, setStoredToken, removeStoredToken } from '../services/auth';

export const useAppStore = create((set, get) => ({
  // ===== Authentication State =====
  user: null,
  token: null,
  loading: true,
  errors: {},

  // ===== Organization State =====
  organization: null,
  organizations: [],

  // ===== Assessment State =====
  currentAssessment: null,
  assessments: [],
  assessmentLoading: false,

  // ===== Policy State =====
  policies: [],
  policiesLoading: false,

  // ===== Alert State =====
  alerts: [],
  alertsLoading: false,

  // ===== UI State =====
  sidebar: {
    collapsed: false,
    activeItem: 'dashboard',
  },

  // ===== INITIALIZATION =====
  /**
   * Initialize authentication on app load
   * Check for stored token and restore session
   */
  initializeAuth: async () => {
    try {
      const token = getStoredToken();
      if (token) {
        const user = await api.getUser();
        set({ user, token, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      removeStoredToken();
      set({ loading: false });
    }
  },

  // ===== AUTHENTICATION ACTIONS =====
  /**
   * Sign in with email and password
   */
  signIn: async (email, password) => {
    set({ loading: true, errors: {} });
    try {
      const { user, token } = await api.signIn(email, password);
      setStoredToken(token);
      set({ user, token, loading: false });
      return { success: true };
    } catch (error) {
      const errorMsg = error.message || 'Sign in failed';
      set({
        loading: false,
        errors: { auth: errorMsg },
      });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * Sign out and clear session
   */
  signOut: () => {
    removeStoredToken();
    set({
      user: null,
      token: null,
      organization: null,
      policies: [],
      alerts: [],
      currentAssessment: null,
    });
  },

  // ===== ORGANIZATION ACTIONS =====
  /**
   * Fetch organization details
   */
  fetchOrganization: async (orgId) => {
    set({ loading: true, errors: {} });
    try {
      const organization = await api.getOrganization(orgId);
      set({ organization, loading: false });
      return organization;
    } catch (error) {
      set((state) => ({
        loading: false,
        errors: { ...state.errors, org: error.message },
      }));
      throw error;
    }
  },

  /**
   * Update organization configuration
   */
  updateOrganization: async (orgId, data) => {
    try {
      const organization = await api.updateOrganization(orgId, data);
      set({ organization });
      return organization;
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, orgUpdate: error.message },
      }));
      throw error;
    }
  },

  /**
   * Submit enterprise discovery form
   */
  submitDiscovery: async (orgId, discoveryData) => {
    set({ assessmentLoading: true, errors: {} });
    try {
      const response = await api.submitDiscovery(orgId, discoveryData);
      const { assessment, policies, alerts } = response;

      set({
        currentAssessment: assessment,
        policies,
        alerts,
        assessmentLoading: false,
      });

      return response;
    } catch (error) {
      set((state) => ({
        assessmentLoading: false,
        errors: { ...state.errors, discovery: error.message },
      }));
      throw error;
    }
  },

  // ===== ASSESSMENT ACTIONS =====
  /**
   * Fetch assessment results
   */
  fetchAssessment: async (assessmentId) => {
    set({ assessmentLoading: true, errors: {} });
    try {
      const assessment = await api.getAssessment(assessmentId);
      set({ currentAssessment: assessment, assessmentLoading: false });
      return assessment;
    } catch (error) {
      set((state) => ({
        assessmentLoading: false,
        errors: { ...state.errors, assessment: error.message },
      }));
      throw error;
    }
  },

  /**
   * Fetch all assessments for organization
   */
  fetchAssessments: async (orgId) => {
    try {
      const assessments = await api.getAssessments(orgId);
      set({ assessments });
      return assessments;
    } catch (error) {
      set((state) => ({
        errors: { ...state.errors, assessments: error.message },
      }));
      throw error;
    }
  },

  // ===== POLICY ACTIONS =====
  /**
   * Fetch all policies
   */
  fetchPolicies: async (orgId) => {
    set({ policiesLoading: true });
    try {
      const policies = await api.getPolicies(orgId);
      set({ policies, policiesLoading: false });
      return policies;
    } catch (error) {
      set({ policiesLoading: false });
      throw error;
    }
  },

  /**
   * Approve a policy
   */
  approvePolicy: async (orgId, policyId, reviewData) => {
    try {
      const updatedPolicy = await api.approvePolicy(orgId, policyId, reviewData);
      set((state) => ({
        policies: state.policies.map((p) =>
          p.id === policyId ? updatedPolicy : p
        ),
      }));
      return updatedPolicy;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reject a policy
   */
  rejectPolicy: async (orgId, policyId, reason) => {
    try {
      const updatedPolicy = await api.rejectPolicy(orgId, policyId, { reason });
      set((state) => ({
        policies: state.policies.map((p) =>
          p.id === policyId ? updatedPolicy : p
        ),
      }));
      return updatedPolicy;
    } catch (error) {
      throw error;
    }
  },

  // ===== ALERT ACTIONS =====
  /**
   * Fetch all alerts
   */
  fetchAlerts: async (orgId) => {
    set({ alertsLoading: true });
    try {
      const alerts = await api.getAlerts(orgId);
      set({ alerts, alertsLoading: false });
      return alerts;
    } catch (error) {
      set({ alertsLoading: false });
      throw error;
    }
  },

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert: async (orgId, alertId) => {
    try {
      const updatedAlert = await api.acknowledgeAlert(orgId, alertId);
      set((state) => ({
        alerts: state.alerts.map((a) =>
          a.id === alertId ? updatedAlert : a
        ),
      }));
      return updatedAlert;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Dismiss an alert
   */
  dismissAlert: async (orgId, alertId) => {
    try {
      const updatedAlert = await api.dismissAlert(orgId, alertId);
      set((state) => ({
        alerts: state.alerts.map((a) =>
          a.id === alertId ? updatedAlert : a
        ),
      }));
      return updatedAlert;
    } catch (error) {
      throw error;
    }
  },

  // ===== UI ACTIONS =====
  /**
   * Toggle sidebar collapsed state
   */
  toggleSidebar: () => {
    set((state) => ({
      sidebar: { ...state.sidebar, collapsed: !state.sidebar.collapsed },
    }));
  },

  /**
   * Set active navigation item
   */
  setActiveNavItem: (item) => {
    set((state) => ({
      sidebar: { ...state.sidebar, activeItem: item },
    }));
  },

  // ===== UTILITY FUNCTIONS =====
  /**
   * Clear all errors
   */
  clearErrors: () => {
    set({ errors: {} });
  },

  /**
   * Get unacknowledged alert count
   */
  getUnacknowledgedAlertCount: () => {
    const { alerts } = get();
    return alerts.filter((a) => a.status === 'sent').length;
  },

  /**
   * Get pending policy count
   */
  getPendingPolicyCount: () => {
    const { policies } = get();
    return policies.filter((p) => p.status === 'pending_review').length;
  },

  /**
   * Get critical findings count
   */
  getCriticalFindingsCount: () => {
    const { currentAssessment } = get();
    if (!currentAssessment || !currentAssessment.findings) return 0;
    return currentAssessment.findings.filter((f) => f.severity === 'critical')
      .length;
  },
}));
