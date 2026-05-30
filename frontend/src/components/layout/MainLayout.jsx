/**
 * components/layout/MainLayout.jsx
 * 
 * Main layout wrapper combining Sidebar and Topbar.
 * 
 * Structure:
 * - Sidebar (left navigation)
 * - Topbar (org info + user menu)
 * - ContentArea (scrollable main content)
 * 
 * Used by all protected pages (Dashboard, Policies, etc.)
 */

import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './MainLayout.css';

export default function MainLayout({ children, showSidebar = true }) {
  return (
    <div className="main-layout">
      {showSidebar && <Sidebar />}
      <div className="main-content">
        <Topbar />
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
}
