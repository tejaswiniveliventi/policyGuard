/**
 * pages/AssessmentResults.jsx
 * 
 * Detailed assessment results page with:
 * - Summary metrics (Critical/High/Medium findings)
 * - Tabbed view: Findings | Policies | Recommendations
 * - Finding cards with severity and remediation
 * - Policy cards for review/approval
 * - Export report button
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import MainLayout from '../components/layout/MainLayout';
import SummaryCards from '../components/assessment/SummaryCards';
import FindingCard from '../components/assessment/FindingCard';
import PolicyCard from '../components/assessment/PolicyCard';
import Tabs from '../components/assessment/Tabs';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import '../styles/assessment.css';

export default function AssessmentResults() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const {
    organization,
    currentAssessment,
    fetchAssessment,
    approvePolicy,
    rejectPolicy,
    setActiveNavItem,
  } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('findings');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setActiveNavItem('policies');
    const initializeAssessment = async () => {
      try {
        await fetchAssessment(assessmentId);
      } catch (error) {
        console.error('Failed to load assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAssessment();
  }, [assessmentId]);

  const handleApprovePolicy = async (policyId) => {
    try {
      await approvePolicy(organization.id, policyId, {
        reviewed_by: 'current_user',
      });
      alert('Policy approved successfully');
    } catch (error) {
      console.error('Failed to approve policy:', error);
      alert('Failed to approve policy');
    }
  };

  const handleRejectPolicy = async (policyId) => {
    const reason = prompt('Enter reason for rejection:');
    if (reason) {
      try {
        await rejectPolicy(organization.id, policyId, reason);
        alert('Policy rejected');
      } catch (error) {
        console.error('Failed to reject policy:', error);
        alert('Failed to reject policy');
      }
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // TODO: Implement export
      alert('Export feature coming soon');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner fullPage={false} message="Loading assessment..." />
      </MainLayout>
    );
  }

  if (!currentAssessment) {
    return (
      <MainLayout>
        <Card>
          <p>Assessment not found</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </MainLayout>
    );
  }

  const findings = currentAssessment.findings || [];
  const policies = currentAssessment.policies || [];
  const estimatedEffort = currentAssessment.estimated_effort_days || 0;

  const tabs = [
    {
      id: 'findings',
      label: 'Findings',
      icon: '🔍',
      badge: findings.length,
      content: (
        <div className="assessment-findings">
          {findings.length === 0 ? (
            <p className="empty-message">✅ No findings detected</p>
          ) : (
            findings.map((finding, idx) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                index={idx}
                onApprove={(fid) => console.log('Approve:', fid)}
                onDismiss={(fid) => console.log('Dismiss:', fid)}
              />
            ))
          )}
        </div>
      ),
    },
    {
      id: 'policies',
      label: 'Policies',
      icon: '📋',
      badge: policies.length,
      content: (
        <div className="assessment-policies">
          {policies.length === 0 ? (
            <p className="empty-message">No policies generated</p>
          ) : (
            policies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                onApprove={() => handleApprovePolicy(policy.id)}
                onModify={() => navigate(`/policies/${policy.id}`)}
                onReject={() => handleRejectPolicy(policy.id)}
              />
            ))
          )}
        </div>
      ),
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: '💡',
      content: (
        <div className="assessment-recommendations">
          <Card title="Next Steps">
            <ol className="recommendations-list">
              <li>Review all critical and high severity findings</li>
              <li>Approve auto-generated policies for your organization</li>
              <li>Assign remediation tasks to team members</li>
              <li>Track progress on remediation items</li>
              <li>Schedule follow-up assessment in 30 days</li>
            </ol>
          </Card>

          <Card title="Remediation Plan">
            <div className="effort-breakdown">
              <div className="effort-item">
                <span className="effort-label">Total Estimated Effort</span>
                <span className="effort-value">{estimatedEffort} days</span>
              </div>
              <div className="effort-item">
                <span className="effort-label">Critical Items</span>
                <span className="effort-value">
                  {findings.filter((f) => f.severity === 'critical').length}
                </span>
              </div>
              <div className="effort-item">
                <span className="effort-label">High Priority Items</span>
                <span className="effort-value">
                  {findings.filter((f) => f.severity === 'high').length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="assessment-container">
        {/* Header */}
        <div className="assessment-header">
          <div>
            <h1>Assessment Results</h1>
            <p>
              Assessment from{' '}
              {new Date(currentAssessment.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="assessment-header-buttons">
            <Button variant="secondary" onClick={handleExport} loading={exporting}>
              📥 Export Report
            </Button>
            <Button onClick={() => navigate('/discovery')}>
              🔄 Run New Assessment
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <section className="assessment-summary">
          <SummaryCards
            findings={findings}
            estimatedEffort={estimatedEffort}
          />
        </section>

        {/* Tabs */}
        <section className="assessment-tabs">
          <Tabs tabs={tabs} defaultTab="findings" onChange={setActiveTab} />
        </section>
      </div>
    </MainLayout>
  );
}
