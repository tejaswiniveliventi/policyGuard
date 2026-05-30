/**
 * pages/Dashboard.jsx
 * 
 * Main dashboard page showing:
 * - 4-column KPI grid (Critical, High, Medium, Last Assessment)
 * - Critical findings section
 * - Compliance frameworks status
 * - Recent policies list
 * 
 * Shows empty state if no assessment has been run.
 * Otherwise shows populated data from latest assessment.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import MainLayout from '../components/layout/MainLayout';
import KPIGrid from '../components/dashboard/KPIGrid';
import CriticalFindings from '../components/dashboard/CriticalFindings';
import ComplianceStatus from '../components/dashboard/ComplianceStatus';
import RecentPolicies from '../components/dashboard/RecentPolicies';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    organization,
    currentAssessment,
    policies,
    alerts,
    fetchAssessments,
    fetchPolicies,
    fetchAlerts,
    setActiveNavItem,
  } = useAppStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveNavItem('dashboard');
    const initializeDashboard = async () => {
      try {
        if (organization?.id) {
          await Promise.all([
            fetchAssessments(organization.id),
            fetchPolicies(organization.id),
            fetchAlerts(organization.id),
          ]);
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [organization?.id]);

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner fullPage={false} message="Loading dashboard..." />
      </MainLayout>
    );
  }

  // Empty state - no assessment run yet
  if (!currentAssessment) {
    return (
      <MainLayout>
        <div className="dashboard-empty-state">
          <Card className="empty-state-card">
            <div className="empty-state-icon">📋</div>
            <h2>Welcome to PolicyGuard</h2>
            <p>
              You haven't run an assessment yet. Start by completing our enterprise
              discovery form to analyze your environment and generate compliance policies.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/discovery')}
            >
              🚀 Run Your First Assessment
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Populated state
  const findings = currentAssessment.findings || [];
  const criticalCount = findings.filter((f) => f.severity === 'critical').length;
  const highCount = findings.filter((f) => f.severity === 'high').length;
  const mediumCount = findings.filter((f) => f.severity === 'medium').length;
  const unacknowledgedAlerts = alerts.filter((a) => a.status === 'sent').length;

  const kpis = [
    {
      label: 'Critical Findings',
      value: criticalCount,
      status: criticalCount > 0 ? 'critical' : 'success',
      icon: '🔴',
      onClick: () => navigate('/assessment/' + currentAssessment.id),
    },
    {
      label: 'High Risk Issues',
      value: highCount,
      status: highCount > 0 ? 'warning' : 'success',
      icon: '🟠',
      onClick: () => navigate('/assessment/' + currentAssessment.id),
    },
    {
      label: 'Medium Risk',
      value: mediumCount,
      status: 'neutral',
      icon: '🟡',
      onClick: () => navigate('/assessment/' + currentAssessment.id),
    },
    {
      label: 'Unread Alerts',
      value: unacknowledgedAlerts,
      status: unacknowledgedAlerts > 0 ? 'warning' : 'success',
      icon: '🚨',
      onClick: () => navigate('/alerts'),
    },
  ];

  return (
    <MainLayout>
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>
              Last assessment:{' '}
              {new Date(currentAssessment.created_at).toLocaleDateString()}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/discovery')}
          >
            📲 Run New Assessment
          </Button>
        </div>

        {/* KPI Grid */}
        <section className="dashboard-section">
          <KPIGrid kpis={kpis} />
        </section>

        {/* Main Grid - Findings + Compliance */}
        <section className="dashboard-grid-2col">
          <CriticalFindings
            findings={findings}
            loading={false}
            onViewAll={() => navigate('/assessment/' + currentAssessment.id)}
          />

          <ComplianceStatus
            frameworks={currentAssessment.compliance_status || {}}
            loading={false}
          />
        </section>

        {/* Recent Policies */}
        <section className="dashboard-section">
          <RecentPolicies
            policies={policies}
            loading={false}
            onViewPolicy={(policyId) => navigate(`/policies/${policyId}`)}
          />
        </section>
      </div>
    </MainLayout>
  );
}
