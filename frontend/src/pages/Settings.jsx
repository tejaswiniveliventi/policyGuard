/**
 * pages/Settings.jsx
 * 
 * Settings hub with sub-pages:
 * - Organization: name, industry, contact info
 * - Team: member management, roles
 * - Integrations: Slack, email, API tokens
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import '../styles/settings.css';

// Sub-page components
import SettingsOrganization from './Settings/SettingsOrganization';
import SettingsTeam from './Settings/SettingsTeam';
import SettingsIntegrations from './Settings/SettingsIntegrations';

const SETTINGS_TABS = [
  { id: 'org', label: 'Organization', icon: '🏢' },
  { id: 'team', label: 'Team', icon: '👥' },
  { id: 'integrations', label: 'Integrations', icon: '⚙️' },
];

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('org');

  useEffect(() => {
    // Determine active tab from URL
    const pathParts = location.pathname.split('/');
    const tab = pathParts[pathParts.length - 1] || 'org';
    if (SETTINGS_TABS.find((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  const renderSettings = () => {
    switch (activeTab) {
      case 'org':
        return <SettingsOrganization />;
      case 'team':
        return <SettingsTeam />;
      case 'integrations':
        return <SettingsIntegrations />;
      default:
        return <SettingsOrganization />;
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    navigate(`/settings/${tabId}`);
  };

  return (
    <MainLayout>
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <h1>Settings</h1>
        </div>

        {/* Tab Navigation */}
        <div className="settings-tabs">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          {renderSettings()}
        </div>
      </div>
    </MainLayout>
  );
}
