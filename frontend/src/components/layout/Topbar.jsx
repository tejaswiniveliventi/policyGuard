/**
 * components/layout/Topbar.jsx
 * 
 * Top header bar showing:
 * - Organization name and metadata
 * - Quick action buttons (Run Assessment)
 * - User menu / avatar
 * 
 * Appears at the top of all protected pages.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import './Topbar.css';

export default function Topbar() {
  const navigate = useNavigate();
  const { organization, user, signOut } = useAppStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!organization) {
    return (
      <div className="topbar">
        <div className="topbar-placeholder">Loading...</div>
      </div>
    );
  }

  const getInitials = (name) => {
    return (name || 'User')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="org-info">
          <div className="org-name">{organization.org_name}</div>
          <div className="org-meta">
            {organization.primary_industry && <span>{organization.primary_industry}</span>}
            {organization.num_facilities > 0 && (
              <span>{organization.num_facilities} locations</span>
            )}
            {organization.num_users > 0 && (
              <span>{organization.num_users.toLocaleString()} users</span>
            )}
          </div>
        </div>
      </div>

      <div className="topbar-right">
        <button
          className="topbar-btn topbar-btn-primary"
          onClick={() => navigate('/discovery')}
        >
          📲 Run Assessment
        </button>

        <div className="topbar-user">
          <button
            className="user-avatar-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">{getInitials(user?.name)}</div>
          </button>

          {showUserMenu && (
            <div className="user-menu">
              <div className="user-menu-header">
                <div className="user-menu-name">{user?.name}</div>
                <div className="user-menu-email">{user?.email}</div>
              </div>
              <div className="user-menu-divider" />
              <button
                className="user-menu-item"
                onClick={() => {
                  navigate('/settings/org');
                  setShowUserMenu(false);
                }}
              >
                ⚙️ Settings
              </button>
              <button
                className="user-menu-item"
                onClick={() => {
                  navigate('/audit');
                  setShowUserMenu(false);
                }}
              >
                📋 Audit Log
              </button>
              <div className="user-menu-divider" />
              <button
                className="user-menu-item user-menu-item-danger"
                onClick={() => {
                  signOut();
                  navigate('/signin');
                }}
              >
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
