/**
 * components/dashboard/ComplianceStatus.jsx
 * 
 * Show status of compliance frameworks (HIPAA, GDPR, SOX, etc.)
 * 
 * Props:
 * - frameworks: object with framework names and status
 * - loading: boolean
 */

import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
//import './ComplianceStatus.css';

export default function ComplianceStatus({ frameworks = {}, loading = false }) {
  if (loading) {
    return (
      <Card title="Compliance Frameworks">
        <p>Loading...</p>
      </Card>
    );
  }

  const frameworkList = [
    { name: 'HIPAA', key: 'hipaa', icon: '🏥' },
    { name: 'GDPR', key: 'gdpr', icon: '🇪🇺' },
    { name: 'CCPA', key: 'ccpa', icon: '🇺🇸' },
    { name: 'SOX', key: 'sox', icon: '📊' },
    { name: 'ISO 27001', key: 'iso27001', icon: '✅' },
    { name: 'NIST', key: 'nist', icon: '🔐' },
  ];

  return (
    <Card title="Compliance Frameworks">
      <div className="compliance-grid">
        {frameworkList.map((fw) => {
          const status = frameworks[fw.key];
          const isCertified = status?.certified || false;
          const lastAudit = status?.last_audit;

          return (
            <div key={fw.key} className="compliance-item">
              <div className="compliance-header">
                <span className="compliance-icon">{fw.icon}</span>
                <span className="compliance-name">{fw.name}</span>
              </div>

              <div className="compliance-status">
                {isCertified ? (
                  <Badge variant="success">Certified</Badge>
                ) : (
                  <Badge variant="warning">Not Certified</Badge>
                )}
              </div>

              {lastAudit && (
                <p className="compliance-audit">Audited: {lastAudit}</p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
