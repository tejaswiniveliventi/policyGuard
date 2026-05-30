/**
 * Global App State Management
 * Uses Zustand for lightweight state management
 */

import {create} from 'zustand';

const useAppStore = create((set, get) => ({
  // Organization state
  currentOrg: null,
  setCurrentOrg: (org) => set({ currentOrg: org }),

  // UI state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Alerts state
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  updateAlert: (alertId, updates) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.alert_id === alertId ? { ...a, ...updates } : a
      ),
    })),

  // Policies state
  policies: [],
  setPolicies: (policies) => set({ policies }),
  addPolicy: (policy) => set((state) => ({ policies: [policy, ...state.policies] })),
  updatePolicy: (policyId, updates) =>
    set((state) => ({
      policies: state.policies.map((p) =>
        p.policy_id === policyId ? { ...p, ...updates } : p
      ),
    })),

  // Scan state
  isScanRunning: false,
  setIsScanRunning: (running) => set({ isScanRunning: running }),

  // Notification preferences
  notificationPrefs: null,
  setNotificationPrefs: (prefs) => set({ notificationPrefs: prefs }),
}));

export default useAppStore;