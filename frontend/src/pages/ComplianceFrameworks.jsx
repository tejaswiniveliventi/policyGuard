/**
 * pages/ComplianceFrameworks.jsx
 * 
 * Compliance frameworks overview showing:
 * - Status of HIPAA, GDPR, SOX, ISO 27001, NIST, etc.
 * - Last audit date for each framework
 * - Compliance gaps per framework
 * - Remediation progress
 */

import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import '../styles/frameworks.css';

const FRAMEWORKS = [
  {
    id: 'hipaa',
    name: 'HIPAA',
    icon: '🏥',
    description: 'Health Insurance Portability and Accountability Act',
    applicability: 'Healthcare organizations handling PHI',
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    icon: '🇪🇺',
    description: 'General Data Protection Regulation',
    applicability: 'Organizations processing EU resident data',
  },
  {
    id: 'ccpa',
    name: 'CCPA',
    icon: '🇺🇸',
    description: 'California Consumer Privacy Act',
    applicability: 'Organizations processing California resident data',
  },
  {
    id: 'sox',
    name: 'SOX',
    icon: '📊',
    description: 'Sarbanes-Oxley Act',
    applicability: 'Public companies',
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    icon: '✅',
    description: 'Information Security Management',
    applicability: 'All organizations',
  },
  {
    id: 'nist',
    name: 'NIST',
    icon: '🔐',
    description: 'National Institute of Standards & Technology',
    applicability: 'Organizations in critical infrastructure sectors',
  },
];

export default function ComplianceFrameworks() {
  const { organization, currentAssessment, setActiveNavItem } = useAppStore();
  const [frameworks, setFrameworks] = useState({});

  useEffect(() => {
    setActiveNavItem('frameworks');
    if (currentAssessment?.compliance_status) {
      setFrameworks(currentAssessment.compliance_status);
    }
  }, [currentAssessment]);

  const getComplianceStatus = (frameworkId) => {
    const status = frameworks[frameworkId];
    if (!status) return null;
    return status;
  };

  return (
    <MainLayout>
      <div className="frameworks-container">
        {/* Header */}
        <div className="frameworks-header">
          <h1>Compliance Frameworks</h1>
          <p>Track compliance status across industry standards and regulations</p>
        </div>

        {/* Frameworks Grid */}
        <div className="frameworks-grid">
          {FRAMEWORKS.map((framework) => {
            const status = getComplianceStatus(framework.id);
            const isCertified = status?.certified || false;
            const lastAudit = status?.last_audit;
            const gapCount = status?.gaps?.length || 0;

            return (
              <Card
                key={framework.id}
                className={`framework-card ${
                  isCertified ? 'certified' : 'not-certified'
                }`}
              >
                <div className="framework-header">
                  <span className="framework-icon">{framework.icon}</span>
                  <h3 className="framework-name">{framework.name}</h3>
                </div>

                <p className="framework-description">{framework.description}</p>

                <div className="framework-applicability">
                  <strong>Applicability:</strong>
                  <p>{framework.applicability}</p>
                </div>

                <div className="framework-status">
                  {isCertified ? (
                    <Badge variant="success">✓ Certified</Badge>
                  ) : (
                    <Badge variant="warning">⊘ Not Certified</Badge>
                  )}
                </div>

                {lastAudit && (
                  <div className="framework-audit">
                    <strong>Last Audit:</strong>
                    <p>{new Date(lastAudit).toLocaleDateString()}</p>
                  </div>
                )}

                {gapCount > 0 && (
                  <div className="framework-gaps">
                    <strong>{gapCount} gaps found</strong>
                    <div className="gaps-list">
                      {status.gaps?.map((gap, idx) => (
                        <div key={idx} className="gap-item">
                          <span className="gap-icon">⚠️</span>
                          <span className="gap-text">{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!status && (
                  <div className="framework-not-assessed">
                    <p>Not yet assessed</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Legend */}
        <Card title="Legend" className="frameworks-legend">
          <div className="legend-items">
            <div className="legend-item">
              <Badge variant="success">✓ Certified</Badge>
              <p>Organization is certified for this framework</p>
            </div>
            <div className="legend-item">
              <Badge variant="warning">⊘ Not Certified</Badge>
              <p>Organization is not certified but framework is applicable</p>
            </div>
            <div className="legend-item">
              <p>No badge = Framework not yet assessed</p>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <Card title="Recommendations" className="frameworks-recommendations">
          <ol className="recommendations-list">
            <li>
              Prioritize certification for frameworks marked as "Not Certified"
            </li>
            <li>Schedule regular audits (annually recommended)</li>
            <li>Address all identified gaps within your remediation timeline</li>
            <li>
              Maintain audit trails for compliance verification by external
              auditors
            </li>
            <li>Update compliance status as certifications are achieved</li>
          </ol>
        </Card>
      </div>
    </MainLayout>
  );
}
