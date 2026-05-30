import React from 'react';
import { useDiscoveryStore } from '../../store/discoveryStore';
import FormSection from './FormSection';
import '../../styles/discovery.css';

const FRAMEWORKS = [
  { id: 'hipaa', label: 'HIPAA', description: 'US healthcare privacy' },
  { id: 'hitech', label: 'HITECH Act', description: 'Healthcare IT security' },
  { id: 'gdpr', label: 'GDPR', description: 'EU data protection' },
  { id: 'ccpa', label: 'CCPA/CPRA', description: 'California privacy' },
  { id: 'sox', label: 'SOX', description: 'Financial reporting compliance' },
  { id: 'iso27001', label: 'ISO 27001', description: 'Information security management' },
  { id: 'iso27002', label: 'ISO 27002', description: 'Security techniques code of practice' },
  { id: 'nist', label: 'NIST Framework', description: 'US government standards' },
  { id: 'hitrust', label: 'HITRUST', description: 'Common Security Framework' },
];

export default function Section5Compliance() {
  const { discovery, updateNestedField } = useDiscoveryStore();

  const frameworks = discovery.compliance_frameworks || {};
  const governance = discovery.governance_structure || {};

  return (
    <div className="discovery-section">
      <FormSection
        title="Compliance & Governance"
        description="What regulatory frameworks apply to your organization? (Mandatory Fields Required)"
      >
        <div className="section-content">

          {/* 1. Compliance Framework Toggles (CRITICAL: Mandated by Store Validation Case 5) */}
          <div className="form-group" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #4e73df' }}>
            <label className="form-label" style={{ fontWeight: 'bold' }}>
              Applicable Compliance Frameworks *
            </label>
            <p style={{ fontSize: '13px', color: '#666', margin: '0 0 10px 0' }}>
              At least one framework must be toggled to "Certified/Active" to satisfy form submission logic.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FRAMEWORKS.map((fw) => {
                const isCertified = frameworks[fw.id]?.certified || false;
                return (
                  <label key={fw.id} className="checkbox-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={isCertified}
                      onChange={(e) => {
                        updateNestedField(`compliance_frameworks.${fw.id}`, {
                          certified: e.target.checked,
                          last_audit: e.target.checked ? new Date().toISOString().split('T')[0] : null,
                          areas: []
                        });
                      }}
                    />
                    <div>
                      <strong>{fw.label}</strong>
                      <span style={{ display: 'block', fontSize: '12px', color: '#666' }}>{fw.description}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. Corporate Governance Structure Mapping */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 'bold' }}>Corporate Governance & Policies</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={governance.has_ciso || false}
                  onChange={(e) => updateNestedField('governance_structure.has_ciso', e.target.checked)}
                />
                <span> Chief Information Security Officer (CISO) on staff</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={governance.has_dpo || false}
                  onChange={(e) => updateNestedField('governance_structure.has_dpo', e.target.checked)}
                />
                <span> Data Protection Officer (DPO) on staff</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={governance.has_ethics_board || false}
                  onChange={(e) => updateNestedField('governance_structure.has_ethics_board', e.target.checked)}
                />
                <span> AI Ethics / Algorithm Governance Board established</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={governance.has_data_governance_office || false}
                  onChange={(e) => updateNestedField('governance_structure.has_data_governance_office', e.target.checked)}
                />
                <span> Formal Data Governance Office operating</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={governance.has_security_policy || false}
                  onChange={(e) => updateNestedField('governance_structure.has_security_policy', e.target.checked)}
                />
                <span> Documented Information Security Policy</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={governance.has_ai_policy || false}
                  onChange={(e) => updateNestedField('governance_structure.has_ai_policy', e.target.checked)}
                />
                <span> Documented Enterprise AI Usage Policy</span>
              </label>

            </div>
          </div>

          {/* 3. Review Frequency Evaluation */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Policy Review & Governance Frequency</label>
            <select
              value={governance.policy_review_frequency || ''}
              onChange={(e) => updateNestedField('governance_structure.policy_review_frequency', e.target.value)}
              className="form-input"
            >
              <option value="">Select frequency...</option>
              <option value="continuous">Continuous monitoring loop</option>
              <option value="quarterly">Quarterly audits</option>
              <option value="semi_annually">Semi-annually audits</option>
              <option value="annually">Annually reviewed</option>
              <option value="ad_hoc">Ad-hoc reviews</option>
            </select>
          </div>

        </div>
      </FormSection>
    </div>
  );
}