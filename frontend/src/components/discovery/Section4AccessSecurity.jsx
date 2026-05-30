import React from 'react';
import { useDiscoveryStore } from '../../store/discoveryStore';
import FormSection from './FormSection';
import Input from '../common/Input';
import '../../styles/discovery.css';

export default function Section4AccessSecurity() {
  // Leveraged the precise function exposed by your store
  const { discovery, updateNestedField } = useDiscoveryStore();

  // Safely extract nested structures from the store layout
  const accessControl = discovery.access_control || {};
  const dataSecurity = discovery.data_security || {};
  const auditLogging = discovery.audit_logging || {};

  return (
    <div className="discovery-section">
      <FormSection
        title="Access Control & Security"
        description="Document how you control access to systems and protect data"
      >
        <div className="section-content">

          {/* 1. Mandatory Access Controls (Mapped to access_control schema flags for validation) */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
              Access Control Methods * (Select at least one to satisfy validation)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={accessControl.rbac || false}
                  onChange={(e) => updateNestedField('access_control.rbac', e.target.checked)}
                />
                <div>
                  <strong>Role-Based Access Control (RBAC)</strong>
                  <div style={{ fontSize: '13px', color: '#666' }}>Users have roles with specific permissions</div>
                </div>
              </label>

              <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={accessControl.abac || false}
                  onChange={(e) => updateNestedField('access_control.abac', e.target.checked)}
                />
                <div>
                  <strong>Attribute-Based Access Control (ABAC)</strong>
                  <div style={{ fontSize: '13px', color: '#666' }}>Context/rule-based runtime assignment permissions</div>
                </div>
              </label>
            </div>
          </div>

          {/* 2. Authentication Parameters */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="checkbox-label" style={{ marginRight: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                checked={accessControl.saml_sso || false}
                onChange={(e) => updateNestedField('access_control.saml_sso', e.target.checked)}
              />
              <span>Centralized SAML Single Sign-On (SSO) Enforced</span>
            </label>

            <label className="checkbox-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                checked={accessControl.mfa_enforced || false}
                onChange={(e) => updateNestedField('access_control.mfa_enforced', e.target.checked)}
              />
              <span>Multi-Factor Authentication (MFA) Enforced</span>
            </label>
          </div>

          {/* 3. Privileged Access Quantifiers */}
          <div className="form-row" style={{ display: 'flex', gap: '20px', marginTop: '1.5rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <Input
                label="Number of Security Roles Configured"
                type="number"
                value={accessControl.num_roles || 0}
                onChange={(e) => updateNestedField('access_control.num_roles', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <Input
                label="Number of Privileged/Admin Users"
                type="number"
                value={accessControl.privileged_users || 0}
                onChange={(e) => updateNestedField('access_control.privileged_users', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* 4. Mandatory Data Encryption Controls (Required by store validation checks) */}
          <div className="form-group" style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
              Encryption Policies *
            </label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={dataSecurity.encryption_at_rest || false}
                  onChange={(e) => updateNestedField('data_security.encryption_at_rest', e.target.checked)}
                />
                <div>
                  <strong>Encryption at Rest * (Mandatory for Validation)</strong>
                  <div style={{ fontSize: '13px', color: '#cc0000', fontWeight: '500' }}>AES-256 baseline or equivalent cryptographic disk protection is required.</div>
                </div>
              </label>

              <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={dataSecurity.encryption_in_transit || false}
                  onChange={(e) => updateNestedField('data_security.encryption_in_transit', e.target.checked)}
                />
                <div>
                  <strong>Encryption in Transit</strong>
                  <div style={{ fontSize: '13px', color: '#666' }}>TLS 1.2 / TLS 1.3 enforcement rules over connection streams.</div>
                </div>
              </label>
            </div>
          </div>

          {/* 5. Additional Security Configurations */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="checkbox-label" style={{ marginRight: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                checked={dataSecurity.tde_enabled || false}
                onChange={(e) => updateNestedField('data_security.tde_enabled', e.target.checked)}
              />
              <span>Transparent Data Encryption (TDE) Active</span>
            </label>

            <label className="checkbox-label" style={{ marginRight: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                checked={dataSecurity.column_encryption || false}
                onChange={(e) => updateNestedField('data_security.column_encryption', e.target.checked)}
              />
              <span>Column/Field Level Encryption Applied</span>
            </label>

            <label className="checkbox-label" style={{ marginRight: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                checked={dataSecurity.masking_enabled || false}
                onChange={(e) => updateNestedField('data_security.masking_enabled', e.target.checked)}
              />
              <span>Dynamic Data Masking Active</span>
            </label>

            <label className="checkbox-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                checked={dataSecurity.tokenization || false}
                onChange={(e) => updateNestedField('data_security.tokenization', e.target.checked)}
              />
              <span>Tokenization Strategy Integrated</span>
            </label>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <Input
              label="Key Management Strategy"
              type="text"
              placeholder="e.g., AWS KMS, HashiCorp Vault, Azure Key Vault"
              value={dataSecurity.key_management || ''}
              onChange={(e) => updateNestedField('data_security.key_management', e.target.value)}
            />
          </div>

          {/* 6. Centralized Audit Logging Infrastructures */}
          <div className="form-group" style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 'bold' }}>Audit Trails & Monitoring Platform</label>
            
            <div style={{ margin: '10px 0 15px' }}>
              <label className="checkbox-label" style={{ marginRight: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="checkbox"
                  checked={auditLogging.centralized_logging || false}
                  onChange={(e) => updateNestedField('audit_logging.centralized_logging', e.target.checked)}
                />
                <span>Centralized Logging Infrastructure In Place</span>
              </label>

              <label className="checkbox-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="checkbox"
                  checked={auditLogging.real_time_alerts || false}
                  onChange={(e) => updateNestedField('audit_logging.real_time_alerts', e.target.checked)}
                />
                <span>Real-Time Security Alerts Active</span>
              </label>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <Input
                  label="Log Retention Period (Days)"
                  type="number"
                  value={auditLogging.log_retention_days || 0}
                  onChange={(e) => updateNestedField('audit_logging.log_retention_days', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <Input
                  label="SIEM System Provider"
                  type="text"
                  placeholder="e.g., Splunk, Datadog, Sentinel"
                  value={auditLogging.siem_system || ''}
                  onChange={(e) => updateNestedField('audit_logging.siem_system', e.target.value)}
                />
              </div>
            </div>
          </div>

        </div>
      </FormSection>
    </div>
  );
}