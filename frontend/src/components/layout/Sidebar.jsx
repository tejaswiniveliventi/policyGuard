/**
 * components/layout/Sidebar.jsx
 * 
 * Left sidebar navigation menu.
 * 
 * Features:
 * - 3 navigation sections (Main, Compliance, Settings)
 * - Dynamic badges for unacknowledged alerts and pending policies
 * - Active item highlighting
 * - Collapse toggle
 * - User profile card at bottom
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import './Sidebar.css';

const NAVIGATION = [
  {
    section: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
      { id: 'alerts', label: 'Alerts', icon: '🚨', path: '/alerts', badgeKey: 'alerts' },
      { id: 'policies', label: 'Policies', icon: '📋', path: '/policies', badgeKey: 'policies' },
    ]
  },
  {
    section: 'Compliance',
    items: [
      { id: 'frameworks', label: 'Frameworks', icon: '✅', path: '/frameworks' },
      { id: 'risk', label: 'Risk Assessment', icon: '📊', path: '/risk' },
      { id: 'audit', label: 'Audit Log', icon: '🔍', path: '/audit' },
    ]
  },
  {
    section: 'Settings',
    items: [
      { id: 'org', label: 'Organization', icon: '🏢', path: '/settings/org' },
      { id: 'team', label: 'Team', icon: '👥', path: '/settings/team' },
      { id: 'integrations', label: 'Integrations', icon: '⚙️', path: '/settings/integrations' },
    ]
  }
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    sidebar: { collapsed },
    toggleSidebar,
    alerts,
    policies,
    user,
  } = useAppStore();

  const isActive = (path) => location.pathname.startsWith(path);

  const getBadgeValue = (badgeKey) => {
    if (badgeKey === 'alerts') {
      return alerts.filter((a) => a.status === 'sent').length;
    }
    if (badgeKey === 'policies') {
      return policies.filter((p) => p.status === 'pending_review').length;
    }
    return 0;
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🛡️</span>
          {!collapsed && <span className="logo-text">PolicyGuard</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAVIGATION.map((section) => (
          <div key={section.section} className="nav-section">
            {!collapsed && <div className="nav-section-title">{section.section}</div>}
            {section.items.map((item) => {
              const active = isActive(item.path);
              const badgeValue = item.badgeKey ? getBadgeValue(item.badgeKey) : 0;

              return (
                <div
                  key={item.id}
                  className={`nav-item ${active ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.path)}
                  title={collapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {badgeValue > 0 && (
                        <span className="nav-badge">{badgeValue}</span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer - User Profile */}
      <div className="sidebar-footer">
        {user && (
          <div className="sidebar-user" onClick={() => handleNavClick('/settings/org')}>
            <div className="user-avatar">
              {(user.name || 'User')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>
            {!collapsed && (
              <div className="user-info">
                <div className="user-name">{user.name || 'User'}</div>
                <div className="user-email">{user.email}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
