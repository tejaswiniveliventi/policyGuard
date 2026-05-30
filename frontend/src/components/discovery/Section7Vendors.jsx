import React from 'react';
import { useDiscoveryStore } from '../../store/discoveryStore';
import FormSection from './FormSection';
import Button from '../common/Button';
import '../../styles/discovery.css';

const VENDOR_CATEGORIES = [
  { id: 'cloud_providers', label: 'Cloud Providers', description: 'AWS, Azure, Google Cloud' },
  { id: 'ml_services', label: 'AI/ML Services', description: 'SageMaker, Vertex AI, custom models' },
  { id: 'database', label: 'Database Services', description: 'Data warehouses, managed databases' },
  { id: 'analytics', label: 'Analytics Platforms', description: 'Tableau, Looker, etc.' },
  { id: 'security', label: 'Security/Compliance Tools', description: 'DLP, SIEM, vulnerability scanning' },
  { id: 'consulting', label: 'Consulting Firms', description: 'Systems integrators, auditors' },
  { id: 'insurance', label: 'Insurance Providers', description: 'Cyber, E&O, D&O insurance' },
];

export default function Section7Vendors() {
  const { 
    discovery, 
    addVendor, 
    updateVendor, 
    removeVendor, 
    updateNestedField 
  } = useDiscoveryStore();

  const vendors = discovery.third_party_vendors || [];
  const management = discovery.vendor_management || {};
  const isSkipped = discovery.skip_vendor_section || false;

  const handleSkipToggle = (e) => {
    const shouldSkip = e.target.checked;
    
    // Set skip flag at root level via updateNestedField
    updateNestedField('skip_vendor_section', shouldSkip);
    
    if (shouldSkip) {
      // Clear store data to keep state pristine when skipped
      updateNestedField('third_party_vendors', []);
      updateNestedField('vendor_management', {
        vendor_assessment_process: false,
        security_questionnaire: false,
        regular_audits: false,
        audit_frequency: '',
        contract_includes_dpa: false,
        vendor_offboarding_process: false,
      });
    }
  };

  return (
    <div className="discovery-section">
      <FormSection
        title="Vendors & Third Parties"
        description="Document key vendors and their access to your data"
      >
        {/* Skip Option Selector */}
        <div className="skip-section-wrapper" style={{ marginBottom: '1.5rem', background: '#f8f9fa', padding: '15px', borderRadius: '6px', border: '1px solid #e3e6f0' }}>
          <label className="checkbox-label" style={{ fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={isSkipped}
              onChange={handleSkipToggle}
            />
            <span>Skip this section (Our organization does not utilize external third-party data sub-processors)</span>
          </label>
        </div>

        {isSkipped ? (
          <div className="skip-notice-box" style={{ padding: '20px', textAlign: 'center', color: '#666', border: '2px dashed #ccc', borderRadius: '6px' }}>
            <p><strong>Section Skipped.</strong> Vendor risk profiling requirements bypassed.</p>
            <p style={{ fontSize: '13px', margin: '5px 0 0' }}>Uncheck the box above if you need to register corporate third-party platforms.</p>
          </div>
        ) : (
          <div className="section-content">
            <div className="tip-box">
              <strong>💡 Important:</strong> Vendor security incidents become your incidents.
              Document all third parties with access to sensitive data.
            </div>

            {/* 1. Dynamic Vendor Array Mapping */}
            <div className="vendors-container">
              <h4 className="vendors-title" style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Vendors with Data Access</h4>

              {vendors.length === 0 ? (
                <div className="empty-state" style={{ padding: '20px', textAlign: 'center', border: '1px dashed #ddd', borderRadius: '6px', marginBottom: '15px' }}>
                  <p>No vendors added yet</p>
                  <p className="empty-hint" style={{ fontSize: '13px', color: '#888' }}>Click below to add your first vendor</p>
                </div>
              ) : (
                vendors.map((vendor, index) => (
                  <div key={vendor.id} className="vendor-card" style={{ border: '1px solid #e3e6f0', padding: '20px', borderRadius: '6px', marginBottom: '20px', background: '#fff' }}>
                    <div className="vendor-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ margin: 0 }}>Vendor {index + 1}: {vendor.name || '(Untitled)'}</h4>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeVendor(vendor.id)}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Vendor Name *</label>
                        <input
                          type="text"
                          value={vendor.name || ''}
                          onChange={(e) => updateVendor(vendor.id, { name: e.target.value })}
                          placeholder="e.g., AWS, DataRobot"
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Category</label>
                        <select
                          value={vendor.type || ''}
                          onChange={(e) => updateVendor(vendor.id, { type: e.target.value })}
                          className="form-input"
                        >
                          <option value="">Select...</option>
                          {VENDOR_CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Security Assessment Status</label>
                        <select
                          value={vendor.security_assessment || 'pending'}
                          onChange={(e) => updateVendor(vendor.id, { security_assessment: e.target.value })}
                          className="form-input"
                        >
                          <option value="pending">Pending Review</option>
                          <option value="approved">Approved</option>
                          <option value="conditional">Conditional Approval</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Contract Execution Date</label>
                        <input
                          type="date"
                          value={vendor.contract_dated || ''}
                          onChange={(e) => updateVendor(vendor.id, { contract_dated: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={vendor.soc2_certified || false}
                          onChange={(e) => updateVendor(vendor.id, { soc2_certified: e.target.checked })}
                        />
                        <span> Holds active SOC 2 / Security Certification</span>
                      </label>

                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={vendor.breach_liability || false}
                          onChange={(e) => updateVendor(vendor.id, { breach_liability: e.target.checked })}
                        />
                        <span> Contract includes explicit breach liability clauses</span>
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Button variant="secondary" onClick={addVendor} fullWidth>
              + Add Another Vendor
            </Button>

            <hr style={{ border: '0', borderTop: '1px solid #e3e6f0', margin: '2rem 0' }} />

            {/* 2. Governance Policy Checkbox Framework */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 'bold' }}>Global Vendor Assessments</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={management.vendor_assessment_process || false}
                    onChange={(e) => updateNestedField('vendor_management.vendor_assessment_process', e.target.checked)}
                  />
                  <span> Formal vendor risk assessment process implemented</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={management.security_questionnaire || false}
                    onChange={(e) => updateNestedField('vendor_management.security_questionnaire', e.target.checked)}
                  />
                  <span> Standard security questionnaire required during onboarding</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={management.regular_audits || false}
                    onChange={(e) => updateNestedField('vendor_management.regular_audits', e.target.checked)}
                  />
                  <span> Conduct regular ongoing compliance audits</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={management.contract_includes_dpa || false}
                    onChange={(e) => updateNestedField('vendor_management.contract_includes_dpa', e.target.checked)}
                  />
                  <span> Standard contract contains Data Processing Addendum (DPA)</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={management.vendor_offboarding_process || false}
                    onChange={(e) => updateNestedField('vendor_management.vendor_offboarding_process', e.target.checked)}
                  />
                  <span> Formal vendor offboarding and data deletion verification process exists</span>
                </label>
              </div>
            </div>

            {/* 3. Vendor Review Frequency Options */}
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label">Vendor Audit Frequency</label>
              <select
                value={management.audit_frequency || ''}
                onChange={(e) => updateNestedField('vendor_management.audit_frequency', e.target.value)}
                className="form-input"
              >
                <option value="">Select frequency...</option>
                <option value="continuous">Continuous automated profiling</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually audited</option>
                <option value="ad_hoc">Ad hoc / On request only</option>
              </select>
            </div>
          </div>
        )}
      </FormSection>
    </div>
  );
}