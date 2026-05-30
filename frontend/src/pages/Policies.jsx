/**
 * pages/Policies.jsx
 * 
 * Policies management page showing:
 * - List of all policies
 * - Filter by status (Draft, Pending Review, Approved, Active)
 * - Search functionality
 * - Links to detail pages
 * - Batch actions
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../styles/policy.css';

const STATUS_OPTIONS = ['all', 'draft', 'pending_review', 'approved', 'active'];

export default function Policies() {
  const navigate = useNavigate();
  const { organization, policies, policiesLoading, fetchPolicies, setActiveNavItem } =
    useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    setActiveNavItem('policies');
    if (organization?.id) {
      fetchPolicies(organization.id);
    }
  }, [organization?.id]);

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.regulation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || policy.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'active':
        return 'success';
      case 'pending_review':
        return 'warning';
      case 'draft':
        return 'default';
      case 'rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  if (policiesLoading) {
    return (
      <MainLayout>
        <LoadingSpinner fullPage={false} message="Loading policies..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="policies-container">
        {/* Header */}
        <div className="policies-header">
          <div>
            <h1>AI Policies</h1>
            <p>Manage and review auto-generated compliance policies</p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/discovery')}
          >
            🔄 Generate New Policies
          </Button>
        </div>

        {/* Filters */}
        <div className="policies-filters">
          <Input
            label="Search policies"
            type="text"
            placeholder="Search by title, description, or regulation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="status-filter">
            <label>Filter by Status:</label>
            <div className="status-buttons">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  className={`filter-btn ${
                    statusFilter === status ? 'active' : ''
                  }`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === 'all' ? 'All Policies' : getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Policies List */}
        {filteredPolicies.length === 0 ? (
          <Card className="empty-state-card">
            <div className="empty-state-icon">📋</div>
            <h3>No policies found</h3>
            <p>
              {policies.length === 0
                ? 'Run an assessment to auto-generate compliance policies'
                : 'Try adjusting your search or filter criteria'}
            </p>
            {policies.length === 0 && (
              <Button
                variant="primary"
                onClick={() => navigate('/discovery')}
              >
                Run Assessment
              </Button>
            )}
          </Card>
        ) : (
          <div className="policies-grid">
            {filteredPolicies.map((policy) => (
              <Card
                key={policy.id}
                className="policy-list-card"
                onClick={() => navigate(`/policies/${policy.id}`)}
              >
                <div className="policy-card-header">
                  <h3 className="policy-card-title">{policy.title}</h3>
                  <Badge variant={getStatusVariant(policy.status)}>
                    {getStatusLabel(policy.status)}
                  </Badge>
                </div>

                <p className="policy-card-description">
                  {policy.description}
                </p>

                <div className="policy-card-meta">
                  {policy.regulation && (
                    <span className="meta-item">
                      📋 {policy.regulation}
                    </span>
                  )}
                  {policy.version && (
                    <span className="meta-item">
                      v{policy.version}
                    </span>
                  )}
                  {policy.created_at && (
                    <span className="meta-item">
                      {new Date(policy.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {policy.status === 'pending_review' && (
                  <div className="policy-card-cta">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/policies/${policy.id}`);
                      }}
                    >
                      Review & Approve →
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {policies.length > 0 && (
          <div className="policies-summary">
            <Card>
              <h3>Policy Summary</h3>
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-label">Total Policies</span>
                  <span className="stat-value">{policies.length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Pending Review</span>
                  <span className="stat-value">
                    {policies.filter((p) => p.status === 'pending_review').length}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Approved</span>
                  <span className="stat-value">
                    {policies.filter(
                      (p) =>
                        p.status === 'approved' || p.status === 'active'
                    ).length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
