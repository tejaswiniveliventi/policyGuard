/**
 * pages/AuditLog.jsx
 * 
 * Complete audit trail showing:
 * - All actions taken in the system
 * - User who performed action
 * - Timestamp
 * - Object affected (policy, alert, config)
 * - Change details
 * - Filters by action type, date range, user
 */

import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../styles/audit.css';

const ACTION_TYPES = [
  'policy_created',
  'policy_updated',
  'policy_approved',
  'policy_rejected',
  'alert_created',
  'alert_acknowledged',
  'alert_dismissed',
  'config_updated',
  'assessment_completed',
  'user_invited',
];

export default function AuditLog() {
  const { organization, setActiveNavItem } = useAppStore();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  useEffect(() => {
    setActiveNavItem('audit');
    const loadAuditLogs = async () => {
      try {
        // TODO: Fetch audit logs from API
        // const logs = await api.getAuditLog(organization.id, {
        //   action: actionFilter !== 'all' ? actionFilter : undefined,
        //   date: dateFilter,
        //   actor: userFilter,
        // });
        // setAuditLogs(logs);

        // Mock data for now
        setAuditLogs([
          {
            id: '1',
            action: 'policy_approved',
            actor: 'user@example.com',
            target_type: 'policy',
            target_id: 'pol-123',
            target_name: 'Data Privacy Policy',
            details: { comment: 'Approved for deployment' },
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            action: 'alert_acknowledged',
            actor: 'user@example.com',
            target_type: 'alert',
            target_id: 'alert-456',
            target_name: 'GDPR Compliance Gap Detected',
            details: {},
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '3',
            action: 'assessment_completed',
            actor: 'System',
            target_type: 'assessment',
            target_id: 'assess-789',
            target_name: 'Enterprise Assessment',
            details: { findings_count: 5 },
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
      } catch (error) {
        console.error('Failed to load audit logs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (organization?.id) {
      loadAuditLogs();
    }
  }, [organization?.id, actionFilter, dateFilter, userFilter]);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction =
      actionFilter === 'all' || log.action === actionFilter;
    const matchesUser =
      userFilter === '' ||
      log.actor.toLowerCase().includes(userFilter.toLowerCase());

    return matchesAction && matchesUser;
  });

  const getActionBadgeVariant = (action) => {
    if (action.includes('approved') || action.includes('created')) {
      return 'success';
    }
    if (action.includes('rejected') || action.includes('dismissed')) {
      return 'danger';
    }
    if (action.includes('updated')) {
      return 'info';
    }
    return 'default';
  };

  const getActionLabel = (action) => {
    return action.replace(/_/g, ' ').toUpperCase();
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner fullPage={false} message="Loading audit log..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="auditlog-container">
        {/* Header */}
        <div className="auditlog-header">
          <h1>Audit Log</h1>
          <p>Complete history of all actions in your organization</p>
        </div>

        {/* Filters */}
        <div className="auditlog-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Filter by Action:</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="all">All Actions</option>
                {ACTION_TYPES.map((action) => (
                  <option key={action} value={action}>
                    {getActionLabel(action)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Filter by User:</label>
              <Input
                type="text"
                placeholder="Search by email..."
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Logs List */}
        {filteredLogs.length === 0 ? (
          <Card className="empty-state-card">
            <p>No audit logs found</p>
          </Card>
        ) : (
          <div className="auditlog-list">
            {filteredLogs.map((log) => (
              <Card key={log.id} className="auditlog-item">
                <div className="auditlog-item-header">
                  <div className="auditlog-action">
                    <Badge variant={getActionBadgeVariant(log.action)}>
                      {getActionLabel(log.action)}
                    </Badge>
                  </div>

                  <div className="auditlog-target">
                    <strong>{log.target_name}</strong>
                    {log.target_type && (
                      <span className="target-type">
                        ({log.target_type})
                      </span>
                    )}
                  </div>

                  <div className="auditlog-timestamp">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="auditlog-item-body">
                  <p className="auditlog-actor">
                    By: <strong>{log.actor}</strong>
                  </p>

                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="auditlog-details">
                      <strong>Details:</strong>
                      <pre>{JSON.stringify(log.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {auditLogs.length > 0 && (
          <Card className="auditlog-summary">
            <h3>Audit Summary</h3>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-label">Total Actions</span>
                <span className="stat-value">{auditLogs.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Unique Users</span>
                <span className="stat-value">
                  {[...new Set(auditLogs.map((l) => l.actor))].length}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Last 24 Hours</span>
                <span className="stat-value">
                  {
                    auditLogs.filter(
                      (l) =>
                        new Date(l.created_at) >
                        new Date(Date.now() - 86400000)
                    ).length
                  }
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
