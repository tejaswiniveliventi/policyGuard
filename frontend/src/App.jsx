/**
 * App.jsx
 * 
 * Main application router and authentication wrapper.
 * 
 * Responsibilities:
 * - Set up React Router with all routes
 * - Implement authentication protection
 * - Load initial app state (user, organization)
 * - Handle loading states
 * 
 * Routes:
 * - Public: / (landing), /signin
 * - Protected: /dashboard, /discovery, /assessment/:id, /policies, /settings/*
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';

// Pages
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import EnterpriseDiscovery from './pages/EnterpriseDiscovery';
import AssessmentResults from './pages/AssessmentResults';
import Policies from './pages/Policies';
import PolicyDetails from './pages/PolicyDetails';
import Alerts from './pages/Alerts';
import ComplianceFrameworks from './pages/ComplianceFrameworks';
import AuditLog from './pages/AuditLog';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Components
import LoadingSpinner from './components/common/LoadingSpinner';

export default function App() {
  const { user, loading, initializeAuth } = useAppStore();

  useEffect(() => {
    // Initialize authentication on app load
    initializeAuth();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/discovery" element={<EnterpriseDiscovery />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discovery" element={<EnterpriseDiscovery />} />
        <Route path="/assessment/:assessmentId" element={<AssessmentResults />} />
        <Route path="/policies" element={<Policies />} /> 
        <Route path="/policies/:policyId" element={<PolicyDetails />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/frameworks" element={<ComplianceFrameworks />} />
        <Route path="/audit" element={<AuditLog />} />
        <Route path="/settings/*" element={<Settings />} />

        {/* Protected routes */}
        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discovery" element={<EnterpriseDiscovery />} />
            <Route path="/assessment/:assessmentId" element={<AssessmentResults />} />
            <Route path="/policies" element={<Policies />} /> 
            <Route path="/policies/:policyId" element={<PolicyDetails />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/frameworks" element={<ComplianceFrameworks />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/settings/*" element={<Settings />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/signin" replace />} />
        )}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
