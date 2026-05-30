/**
 * Main Dashboard Page
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAppStore from '../store/appStore';
import AlertCard from '../components/alerts/AlertCard';
import PolicyCard from '../components/policies/PolicyCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentOrg = useAppStore((state) => state.currentOrg);
  const alerts = useAppStore((state) => state.alerts);
  const policies = useAppStore((state) => state.policies);
  const setAlerts = useAppStore((state) => state.setAlerts);
  const setPolicies = useAppStore((state) => state.setPolicies);
  const isScanRunning = useAppStore((state) => state.isScanRunning);
  const setIsScanRunning = useAppStore((state) => state.setIsScanRunning);

  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    if (!currentOrg && orgId) {
      loadOrgData();
    }
  }, [orgId]);

  const loadOrgData = async () => {
    try {
      const org = await api.getOrg(orgId);
      useAppStore.setState({ currentOrg: org });
      
      const alertsData = await api.getAlerts(orgId);
      setAlerts(alertsData);
      
      const policiesData = await api.getPolicies(orgId);
      setPolicies(policiesData);
    } catch (error) {
      console.error('Failed to load org data:', error);
    }
  };

  const handleTriggerScan = async () => {
    setIsScanRunning(true);
    try {
      await api.triggerPolicyScan(orgId);
      // Reload alerts and policies after scan completes
      setTimeout(() => {
        loadOrgData();
        setIsScanRunning(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to trigger scan:', error);
      setIsScanRunning(false);
    }
  };

  const activeAlerts = alerts.filter((a) => a.status === 'sent');
  const activePolicies = policies.filter((p) => p.status === 'active');

  if (!currentOrg) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentOrg.org_name}</h1>
              <p className="text-gray-600 capitalize">{currentOrg.industry}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleTriggerScan}
                disabled={isScanRunning}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {isScanRunning ? 'Scanning...' : 'Refresh Policy Scan'}
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Active Policies</h3>
            <p className="text-3xl font-bold text-gray-900">{activePolicies.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Pending Alerts</h3>
            <p className="text-3xl font-bold text-red-600">{activeAlerts.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Policies</h3>
            <p className="text-3xl font-bold text-gray-900">{policies.length}</p>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b p-6">
            <h2 className="text-xl font-bold text-gray-900">
              🔴 Alerts ({activeAlerts.length})
            </h2>
          </div>
          <div className="p-6">
            {activeAlerts.length === 0 ? (
              <p className="text-gray-600">No pending alerts</p>
            ) : (
              <div className="grid gap-4">
                {activeAlerts.map((alert) => (
                  <AlertCard key={alert.alert_id} alert={alert} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Policies Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b p-6">
            <h2 className="text-xl font-bold text-gray-900">📋 Policies ({policies.length})</h2>
          </div>
          <div className="p-6">
            {policies.length === 0 ? (
              <p className="text-gray-600">No policies yet</p>
            ) : (
              <div className="space-y-4">
                {policies.map((policy) => (
                  <PolicyCard key={policy.policy_id} policy={policy} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}