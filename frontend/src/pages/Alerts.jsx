/**
 * pages/Alerts.jsx
 * 
 * Alerts management page showing:
 * - List of compliance alerts
 * - Filter by status (sent, acknowledged, dismissed)
 * - Severity indicators
 * - Actions to acknowledge/dismiss
 * - Links to related policies/findings
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../styles/globals.css';

const STATUS_FILTER = ['all', 'sent', 'acknowledged', 'dismissed'];

export default function Alerts() {
  const navigate = useNavigate();
  const {
    organization,
    alerts,
    alertsLoading,
    fetchAlerts,
    acknowledgeAlert,
    dismissAlert,
    setActiveNavItem,
  } = useAppStore();

  const [statusFilter, setStatusFilter] = useState('sent');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    setActiveNavItem('alerts');
    if (organization?.id) {
      fetchAlerts(organization.id);
    }
  }, [organization?.id]);

  const filteredAlerts = alerts.filter((alert) => {
    if (statusFilter === 'all') return true;
    return alert.status === statusFilter;
  });

  const handleAcknowledge = async (alertId) => {
    setActionLoading(alertId);
    try {
      await acknowledgeAlert(organization.id, alertId);
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      alert('Failed to acknowledge alert');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDismiss = async (alertId) => {
    setActionLoading(alertId);
    try {
      await dismissAlert(organization.id, alertId);
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
      alert('Failed to dismiss alert');
    } finally {
      setActionLoading(null);
    }
  };

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'sent':
        return 'Unread';
      case 'acknowledged':
        return 'Acknowledged';
      case 'dismissed':
        return 'Dismissed';
      default:
        return status;
    }
  };

  if (alertsLoading) {
    return (
      <MainLayout>
        <LoadingSpinner fullPage={false} message="Loading alerts..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="alerts-container">
        {/* Header */}
        <div className="alerts-header">
          <div>
            <h1>Compliance Alerts</h1>
            <p>
              {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="alerts-filters">
          <div className="status-filter">
            <label>Filter by Status:</label>
            <div className="filter-buttons">
              {STATUS_FILTER.map((status) => (
                <button
                  key={status}
                  className={`filter-btn ${
                    statusFilter === status ? 'active' : ''
                  }`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === 'all'
                    ? 'All Alerts'
                    : getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <Card className="empty-state-card">
            <div className="empty-state-icon">✅</div>
            <h3>No alerts</h3>
            <p>
              {alerts.length === 0
                ? 'Run an assessment to receive compliance alerts'
                : 'No alerts matching this status'}
            </p>
          </Card>
        ) : (
          <div className="alerts-list">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className="alert-item-card">
                <div className="alert-header">
                  <div className="alert-title-section">
                    <Badge variant={getSeverityVariant(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <h3 className="alert-title">{alert.title}</h3>
                  </div>
                  <Badge variant={alert.status === 'sent' ? 'warning' : 'default'}>
                    {getStatusLabel(alert.status)}
                  </Badge>
                </div>

                <p className="alert-description">{alert.description}</p>

                {alert.recommended_action && (
                  <div className="alert-action">
                    <strong>Recommended Action:</strong>
                    <p>{alert.recommended_action}</p>
                  </div>
                )}

                <div className="alert-meta">
                  {alert.alert_type && (
                    <span className="meta-item">
                      Type: {alert.alert_type.replace('_', ' ')}
                    </span>
                  )}
                  {alert.created_at && (
                    <span className="meta-item">
                      {new Date(alert.created_at).toLocaleDateString()}
                    </span>
                  )}
                  {alert.notified_via && (
                    <span className="meta-item">
                      Via: {alert.notified_via.join(', ')}
                    </span>
                  )}
                </div>

                {alert.status === 'sent' && (
                  <div className="alert-actions">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleAcknowledge(alert.id)}
                      loading={actionLoading === alert.id}
                      disabled={actionLoading === alert.id}
                    >
                      ✓ Acknowledge
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDismiss(alert.id)}
                      loading={actionLoading === alert.id}
                      disabled={actionLoading === alert.id}
                    >
                      × Dismiss
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {alerts.length > 0 && (
          <Card className="alerts-summary">
            <h3>Alert Summary</h3>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-label">Total Alerts</span>
                <span className="stat-value">{alerts.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Unread</span>
                <span className="stat-value">
                  {alerts.filter((a) => a.status === 'sent').length}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Critical</span>
                <span className="stat-value">
                  {alerts.filter((a) => a.severity === 'critical').length}
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
