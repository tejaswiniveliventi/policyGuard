import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EnterpriseDiscovery() {
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);

  const [discovery, setDiscovery] = useState({
    // ===== LEVEL 1: Organization Scope =====
    org_size: 'enterprise',
    num_employees: 0,
    num_facilities: 0,
    num_users: 0,
    geographic_presence: [],
    primary_industry: 'healthcare',
    
    // ===== LEVEL 2: System Inventory =====
    systems_in_use: {
      ehr_systems: [],           // Epic, Cerner, etc.
      crm_systems: [],           // Salesforce, etc.
      data_warehouses: [],       // Snowflake, BigQuery, etc.
      databases: [],             // MySQL, PostgreSQL, Oracle, etc.
      message_queues: [],        // Kafka, RabbitMQ, etc.
      cloud_providers: [],       // AWS, Azure, GCP, etc.
      analytics_platforms: [],   // Tableau, Looker, etc.
      custom_applications: 0,    // Number of internal systems
    },
    
    // ===== LEVEL 3: Data Architecture =====
    data_types_processed: {
      phi: false,               // Protected Health Information
      pii: false,               // Personally Identifiable Info
      financial: false,
      biometric: false,
      genetic: false,
      behavioral: false,
      location: false,
      device_data: false,
      aggregated_only: false,
    },
    
    data_classification: {
      public: 0,                // % of data
      internal: 0,
      confidential: 0,
      restricted: 0,
    },
    
    data_residency: {
      us_only: false,
      eu_only: false,
      global: false,
      specific_countries: [],
    },
    
    data_flows: {
      description: '',          // How does data flow through systems?
      num_integrations: 0,
      num_data_transfers_daily: 0,
      real_time_streaming: false,
      batch_processing: false,
    },
    
    // ===== LEVEL 4: AI/ML Systems =====
    ai_ml_systems: [
      // {
      //   name: "Patient Risk Model",
      //   type: "prediction",  // prediction, classification, nlp, computer_vision, recommendation
      //   purpose: "Identify high-risk patients",
      //   input_data: ["PHI", "labs", "demographics"],
      //   output_actions: "treatment_decisions",
      //   deployed_since: "2022-01",
      //   num_predictions_daily: 100000,
      //   accuracy_measured: true,
      //   bias_testing: false,
      //   explainability_method: "SHAP",
      //   human_override_rate: 10,  // %
      // }
    ],
    
    ml_infrastructure: {
      ml_platform: '',          // MLflow, Kubeflow, SageMaker, etc.
      model_registry: false,
      experiment_tracking: false,
      model_versioning: false,
      deployment_method: '',    // batch, real-time, edge
      monitoring_enabled: false,
      retraining_frequency: '',  // daily, weekly, monthly
    },
    
    // ===== LEVEL 5: Access & Security =====
    access_control: {
      rbac: false,              // Role-Based Access Control
      abac: false,              // Attribute-Based Access Control
      saml_sso: false,
      mfa_enforced: false,
      num_roles: 0,
      privileged_users: 0,
    },
    
    data_security: {
      encryption_at_rest: false,
      encryption_in_transit: false,
      key_management: '',
      tde_enabled: false,        // Transparent Data Encryption
      column_encryption: false,
      masking_enabled: false,
      tokenization: false,
    },
    
    audit_logging: {
      centralized_logging: false,
      siem_system: '',          // Splunk, ELK, etc.
      log_retention_days: 0,
      audit_trail_completeness: 0,  // %
      real_time_alerts: false,
      forensic_capabilities: false,
    },
    
    // ===== LEVEL 6: Compliance & Governance =====
    compliance_frameworks: {
      hipaa: { certified: false, last_audit: null, areas: [] },
      hitech: { certified: false, last_audit: null, areas: [] },
      gdpr: { certified: false, last_audit: null, areas: [] },
      ccpa: { certified: false, last_audit: null, areas: [] },
      sox: { certified: false, last_audit: null, areas: [] },
      iso27001: { certified: false, last_audit: null, areas: [] },
      iso27002: { certified: false, last_audit: null, areas: [] },
      nist: { certified: false, last_audit: null, areas: [] },
      hitrust: { certified: false, last_audit: null, areas: [] },
    },
    
    governance_structure: {
      has_ciso: false,
      has_dpo: false,
      has_ethics_board: false,
      has_data_governance_office: false,
      has_security_policy: false,
      has_ai_policy: false,
      policy_review_frequency: '',  // annually, quarterly, etc.
    },
    
    // ===== LEVEL 7: Risk & Incident Management =====
    risk_management: {
      risk_assessment_framework: '',
      last_risk_assessment: null,
      breach_history: 0,          // Number of past breaches
      breach_notification_process: false,
      incident_response_plan: false,
      disaster_recovery_plan: false,
      rto_hours: 0,               // Recovery Time Objective
      rpo_hours: 0,               // Recovery Point Objective
    },
    
    // ===== LEVEL 8: Third-Party & Vendors =====
    third_party_vendors: [
      // {
      //   name: "AWS",
      //   type: "cloud_provider",
      //   data_access: ["all", "subset"],
      //   security_assessment: "completed",
      //   contract_dated: "2022-01-01",
      //   soc2_certified: true,
      //   breach_liability: "included",
      // }
    ],
    
    vendor_management: {
      vendor_assessment_process: false,
      security_questionnaire: false,
      regular_audits: false,
      audit_frequency: '',
      contract_includes_dpa: false,
      vendor_offboarding_process: false,
    },
    
    // ===== LEVEL 9: Additional Context =====
    regulatory_environment: {
      state_regulations: [],
      industry_specific: [],
      local_requirements: [],
    },
    
    organization_maturity: {
      security_maturity: 0,      // 1-5 scale
      governance_maturity: 0,    // 1-5 scale
      data_quality_maturity: 0,  // 1-5 scale
      ai_readiness: 0,           // 1-5 scale
    },
  });

  const sections = [
    { id: 0, title: "Organization Overview", fields: 6 },
    { id: 1, title: "System Inventory", fields: 8 },
    { id: 2, title: "Data Architecture", fields: 12 },
    { id: 3, title: "AI/ML Systems", fields: 10 },
    { id: 4, title: "Access & Security", fields: 15 },
    { id: 5, title: "Compliance & Governance", fields: 20 },
    { id: 6, title: "Risk Management", fields: 8 },
    { id: 7, title: "Vendors & Third Parties", fields: 10 },
    { id: 8, title: "Maturity Assessment", fields: 4 },
  ];

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/org/enterprise-discovery/${orgId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(discovery),
        }
      );

      const data = await response.json();
      
      if (data.status === 'assessment_complete') {
        alert(`Enterprise assessment complete!\n\nFindings:\n- ${data.findings.length} policy gaps identified\n- ${data.findings.filter(f => f.severity === 'critical').length} critical issues\n- ${data.findings.filter(f => f.severity === 'high').length} high-risk areas`);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Discovery error:', error);
      alert('Failed to submit discovery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Section {currentSection + 1} of {sections.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(((currentSection + 1) / sections.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {sections[currentSection].title}
        </h1>
        <p className="text-gray-600 mb-8">
          Estimated time: 2-3 hours for complete assessment
        </p>

        {/* Section 0: Organization Overview */}
        {currentSection === 0 && (
          <div className="bg-white rounded-lg shadow p-8 space-y-6">
            <h2 className="text-xl font-bold">Organization Scope</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Organization Type</label>
              <select
                value={discovery.org_size}
                onChange={(e) => setDiscovery({ ...discovery, org_size: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="startup">Startup (1-50)</option>
                <option value="midmarket">Mid-Market (50-1000)</option>
                <option value="enterprise">Enterprise (1000+)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Total Employees</label>
              <input
                type="number"
                value={discovery.num_employees}
                onChange={(e) => setDiscovery({ ...discovery, num_employees: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Number of Facilities/Locations</label>
              <input
                type="number"
                value={discovery.num_facilities}
                onChange={(e) => setDiscovery({ ...discovery, num_facilities: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Users/Customers Served</label>
              <input
                type="number"
                value={discovery.num_users}
                onChange={(e) => setDiscovery({ ...discovery, num_users: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Primary Industry</label>
              <select
                value={discovery.primary_industry}
                onChange={(e) => setDiscovery({ ...discovery, primary_industry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="healthcare">Healthcare (HIPAA)</option>
                <option value="financial">Financial Services (PCI-DSS, SOX)</option>
                <option value="education">Education (FERPA)</option>
                <option value="telecom">Telecom</option>
                <option value="retail">Retail</option>
                <option value="government">Government</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Geographic Presence</label>
              <div className="space-y-2">
                {['US', 'EU', 'APAC', 'LATAM', 'China', 'Global'].map((region) => (
                  <label key={region} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={discovery.geographic_presence.includes(region)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDiscovery({
                            ...discovery,
                            geographic_presence: [...discovery.geographic_presence, region]
                          });
                        } else {
                          setDiscovery({
                            ...discovery,
                            geographic_presence: discovery.geographic_presence.filter(r => r !== region)
                          });
                        }
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="ml-2">{region}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 1: System Inventory */}
        {currentSection === 1 && (
          <div className="bg-white rounded-lg shadow p-8 space-y-6">
            <h2 className="text-xl font-bold">System Inventory</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">EHR/Clinical Systems</label>
              <p className="text-xs text-gray-600 mb-3">
                Select all clinical systems in use (Epic, Cerner, Athena, etc.)
              </p>
              <div className="space-y-2">
                {['Epic', 'Cerner', 'Athena', 'Medidata', 'NextGen', 'Open Source'].map((sys) => (
                  <label key={sys} className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded"
                    />
                    <span className="ml-2">{sys}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data Warehouses & Analytics</label>
              <p className="text-xs text-gray-600 mb-3">
                Select all data platforms (Snowflake, BigQuery, Redshift, Databricks)
              </p>
              <div className="space-y-2">
                {['Snowflake', 'BigQuery', 'Redshift', 'Databricks', 'Teradata'].map((sys) => (
                  <label key={sys} className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded"
                    />
                    <span className="ml-2">{sys}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cloud Providers</label>
              <p className="text-xs text-gray-600 mb-3">
                Which cloud platforms do you use?
              </p>
              <div className="space-y-2">
                {['AWS', 'Azure', 'Google Cloud', 'Oracle Cloud', 'On-Premise'].map((cloud) => (
                  <label key={cloud} className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded"
                    />
                    <span className="ml-2">{cloud}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Custom Applications/Microservices
              </label>
              <input
                type="number"
                value={discovery.systems_in_use.custom_applications}
                onChange={(e) => setDiscovery({
                  ...discovery,
                  systems_in_use: {
                    ...discovery.systems_in_use,
                    custom_applications: parseInt(e.target.value)
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Section 2: Data Architecture */}
        {currentSection === 2 && (
          <div className="bg-white rounded-lg shadow p-8 space-y-6">
            <h2 className="text-xl font-bold">Data Architecture & Flow</h2>
            
            <div>
              <label className="block text-sm font-medium mb-3">Data Types Processed</label>
              <div className="space-y-2">
                {[
                  { key: 'phi', label: 'PHI (Protected Health Information)' },
                  { key: 'pii', label: 'PII (Personally Identifiable Info)' },
                  { key: 'financial', label: 'Financial Data' },
                  { key: 'biometric', label: 'Biometric Data' },
                  { key: 'genetic', label: 'Genetic Data' },
                  { key: 'behavioral', label: 'Behavioral Data' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={discovery.data_types_processed[key]}
                      onChange={(e) => setDiscovery({
                        ...discovery,
                        data_types_processed: {
                          ...discovery.data_types_processed,
                          [key]: e.target.checked
                        }
                      })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="ml-2">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Data Classification Distribution (%)
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['public', 'internal', 'confidential', 'restricted'].map((level) => (
                  <div key={level}>
                    <label className="text-xs text-gray-600 capitalize">{level}</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discovery.data_classification[level]}
                      onChange={(e) => setDiscovery({
                        ...discovery,
                        data_classification: {
                          ...discovery.data_classification,
                          [level]: parseInt(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Describe Your Data Flow
              </label>
              <textarea
                value={discovery.data_flows.description}
                onChange={(e) => setDiscovery({
                  ...discovery,
                  data_flows: { ...discovery.data_flows, description: e.target.value }
                })}
                placeholder="E.g., EHR → Data Warehouse → Analytics Platform → AI Models"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Data Integrations
              </label>
              <input
                type="number"
                value={discovery.data_flows.num_integrations}
                onChange={(e) => setDiscovery({
                  ...discovery,
                  data_flows: { ...discovery.data_flows, num_integrations: parseInt(e.target.value) }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Estimated Data Transfers Per Day
              </label>
              <input
                type="number"
                value={discovery.data_flows.num_data_transfers_daily}
                onChange={(e) => setDiscovery({
                  ...discovery,
                  data_flows: { ...discovery.data_flows, num_data_transfers_daily: parseInt(e.target.value) }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="E.g., 50000"
              />
            </div>
          </div>
        )}

        {/* Section 3: AI/ML Systems */}
        {currentSection === 3 && (
          <div className="bg-white rounded-lg shadow p-8 space-y-6">
            <h2 className="text-xl font-bold">AI/ML Systems</h2>
            
            <div className="bg-blue-50 p-4 rounded mb-4">
              <p className="text-sm text-blue-900">
                For each AI/ML system in production, provide details about its purpose, inputs, outputs, and performance monitoring.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                AI/ML Systems in Production
              </label>
              <button
                onClick={() => {
                  setDiscovery({
                    ...discovery,
                    ai_ml_systems: [
                      ...discovery.ai_ml_systems,
                      {
                        name: '',
                        type: 'prediction',
                        purpose: '',
                        input_data: [],
                        output_actions: '',
                        deployed_since: new Date().toISOString().split('T')[0],
                        num_predictions_daily: 0,
                        accuracy_measured: false,
                        bias_testing: false,
                        explainability_method: '',
                        human_override_rate: 0,
                      }
                    ]
                  });
                }}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
              >
                + Add AI System
              </button>

              {discovery.ai_ml_systems.map((system, idx) => (
                <div key={idx} className="border rounded-lg p-4 mb-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">System Name</label>
                    <input
                      type="text"
                      value={system.name}
                      onChange={(e) => {
                        const updated = [...discovery.ai_ml_systems];
                        updated[idx].name = e.target.value;
                        setDiscovery({ ...discovery, ai_ml_systems: updated });
                      }}
                      placeholder="E.g., Patient Risk Prediction Model"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Model Type</label>
                    <select
                      value={system.type}
                      onChange={(e) => {
                        const updated = [...discovery.ai_ml_systems];
                        updated[idx].type = e.target.value;
                        setDiscovery({ ...discovery, ai_ml_systems: updated });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                      <option value="prediction">Prediction</option>
                      <option value="classification">Classification</option>
                      <option value="nlp">Natural Language Processing</option>
                      <option value="computer_vision">Computer Vision</option>
                      <option value="recommendation">Recommendation</option>
                      <option value="anomaly_detection">Anomaly Detection</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Purpose/Business Objective</label>
                    <textarea
                      value={system.purpose}
                      onChange={(e) => {
                        const updated = [...discovery.ai_ml_systems];
                        updated[idx].purpose = e.target.value;
                        setDiscovery({ ...discovery, ai_ml_systems: updated });
                      }}
                      placeholder="What decision does this model support?"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      rows="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Input Data Sources</label>
                    <input
                      type="text"
                      value={system.input_data.join(', ')}
                      onChange={(e) => {
                        const updated = [...discovery.ai_ml_systems];
                        updated[idx].input_data = e.target.value.split(',').map(x => x.trim());
                        setDiscovery({ ...discovery, ai_ml_systems: updated });
                      }}
                      placeholder="E.g., PHI, labs, demographics, claims"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Output Actions</label>
                    <input
                      type="text"
                      value={system.output_actions}
                      onChange={(e) => {
                        const updated = [...discovery.ai_ml_systems];
                        updated[idx].output_actions = e.target.value;
                        setDiscovery({ ...discovery, ai_ml_systems: updated });
                      }}
                      placeholder="E.g., Treatment recommendations, resource allocation"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Accuracy Measured?
                      </label>
                      <select
                        value={system.accuracy_measured ? 'yes' : 'no'}
                        onChange={(e) => {
                          const updated = [...discovery.ai_ml_systems];
                          updated[idx].accuracy_measured = e.target.value === 'yes';
                          setDiscovery({ ...discovery, ai_ml_systems: updated });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Bias Testing Done?
                      </label>
                      <select
                        value={system.bias_testing ? 'yes' : 'no'}
                        onChange={(e) => {
                          const updated = [...discovery.ai_ml_systems];
                          updated[idx].bias_testing = e.target.value === 'yes';
                          setDiscovery({ ...discovery, ai_ml_systems: updated });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Human Override Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={system.human_override_rate}
                      onChange={(e) => {
                        const updated = [...discovery.ai_ml_systems];
                        updated[idx].human_override_rate = parseInt(e.target.value);
                        setDiscovery({ ...discovery, ai_ml_systems: updated });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      % of model recommendations that humans override
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Continue with remaining sections... */}
        {/* Sections 4-8 follow same pattern */}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={currentSection === 0}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          {currentSection === sections.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit & Assess'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}