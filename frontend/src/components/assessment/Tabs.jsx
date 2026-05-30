/**
 * components/assessment/Tabs.jsx
 * 
 * Tab navigation component for assessment results.
 * 
 * Props:
 * - tabs: array of { id, label, content }
 * - defaultTab: string (default tab ID)
 * - onChange: function (tabId) => void
 */

import React, { useState } from 'react';
import '../../styles/components.css';

export default function Tabs({
  tabs,
  defaultTab,
  onChange,
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
            {tab.badge && (
              <span className="tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      <div className="tabs-content">
        {activeTabContent}
      </div>
    </div>
  );
}
