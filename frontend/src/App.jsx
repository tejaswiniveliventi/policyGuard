/**
 * Main App Component with Routing
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAppStore from './store/appStore';
import api from './services/api';

// Pages
import InitialSetup from './pages/InitialSetup';
import Dashboard from './pages/Dashboard';
import AlertDetail from './pages/AlertDetail';
import Settings from './pages/Settings';

function App() {
  const currentOrg = useAppStore((state) => state.currentOrg);
  const setCurrentOrg = useAppStore((state) => state.setCurrentOrg);

  useEffect(() => {
    // Check for saved org on mount
    const orgId = localStorage.getItem('orgId');
    if (orgId && !currentOrg) {
      api.getOrg(orgId).then(setCurrentOrg).catch(console.error);
    }

    // Check backend health
    api.healthCheck().then(console.log).catch(console.error);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Setup Route */}
        <Route path="/setup" element={<InitialSetup />} />

        {/* Dashboard Routes (require org) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alert/:alertId" element={<AlertDetail />} />
        <Route path="/settings" element={<Settings />} />

        {/* Root - Redirect to setup or dashboard */}
        <Route
          path="/"
          element={<Navigate to={currentOrg ? '/dashboard' : '/setup'} />}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;