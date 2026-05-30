/**
 * store/discoveryStore.js
 * * State management for the 9-section Enterprise Discovery form.
 * * Manages:
 * - Current section/step (0-8)
 * - Form data for all 9 sections
 * - Validation state
 * - Submission progress
 */

import { create } from 'zustand';

const INITIAL_DISCOVERY = {
  // ===== ROOT LEVEL SKIP STATES =====
  skip_data_architecture: false,
  skip_ai_systems: false,
  skip_risk_management: false,
  skip_vendor_section: false,
  skip_maturity_section: false,

  // ===== SECTION 0: Organization Overview =====
  org_size: 'enterprise',
  num_employees: 0,
  num_facilities: 0,
  num_users: 0,
  geographic_presence: [],
  primary_industry: 'healthcare',

  // ===== SECTION 1: System Inventory =====
  systems_in_use: {
    ehr_systems: [],
    crm_systems: [],
    data_warehouses: [],
    databases: [],
    message_queues: [],
    cloud_providers: [],
    analytics_platforms: [],
    custom_applications: 0,
  },

  // ===== SECTION 2: Data Architecture =====
  data_types_processed: {
    phi: false,
    pii: false,
    financial: false,
    biometric: false,
    genetic: false,
    behavioral: false,
    location: false,
    device_data: false,
    aggregated_only: false,
  },

  data_classification: {
    public: 0,
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
    description: '',
    num_integrations: 0,
    num_data_transfers_daily: 0,
    real_time_streaming: false,
    batch_processing: false,
  },

  // ===== SECTION 3: AI/ML Systems =====
  ai_ml_systems: [],

  ml_infrastructure: {
    ml_platform: '',
    model_registry: false,
    experiment_tracking: false,
    model_versioning: false,
    deployment_method: '',
    monitoring_enabled: false,
    retraining_frequency: '',
  },

  // ===== SECTION 4: Access & Security =====
  access_control: {
    rbac: false,
    abac: false,
    saml_sso: false,
    mfa_enforced: false,
    num_roles: 0,
    privileged_users: 0,
  },

  data_security: {
    encryption_at_rest: false,
    encryption_in_transit: false,
    key_management: '',
    tde_enabled: false,
    column_encryption: false,
    masking_enabled: false,
    tokenization: false,
  },

  audit_logging: {
    centralized_logging: false,
    siem_system: '',
    log_retention_days: 0,
    audit_trail_completeness: 0,
    real_time_alerts: false,
    forensic_capabilities: false,
  },

  // ===== SECTION 5: Compliance & Governance =====
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
    policy_review_frequency: '',
  },

  // ===== SECTION 6: Risk & Incident Management =====
  risk_management: {
    risk_assessment_framework: '',
    last_risk_assessment: null,
    breach_history: 0,
    breach_notification_process: false,
    incident_response_plan: false,
    disaster_recovery_plan: false,
    rto_hours: 0,
    rpo_hours: 0,
  },

  // ===== SECTION 7: Third-Party & Vendors =====
  third_party_vendors: [],

  vendor_management: {
    vendor_assessment_process: false,
    security_questionnaire: false,
    regular_audits: false,
    audit_frequency: '',
    contract_includes_dpa: false,
    vendor_offboarding_process: false,
  },

  // ===== SECTION 8: Maturity Assessment =====
  organization_maturity: {
    security_maturity: 0,
    governance_maturity: 0,
    data_quality_maturity: 0,
    ai_readiness: 0,
  },
};

// Helper utility to produce clean deep-cloned state structures
const getCleanInitialState = () => JSON.parse(JSON.stringify(INITIAL_DISCOVERY));

export const useDiscoveryStore = create((set, get) => ({
  currentSection: 0,
  discovery: getCleanInitialState(),
  validationErrors: {},
  isSubmitting: false,

  // ===== NAVIGATION =====
  nextSection: () => {
    set((state) => {
      const errors = validateSection(state.currentSection, state.discovery);
      if (Object.keys(errors).length > 0) {
        return { validationErrors: errors };
      }
      return {
        currentSection: Math.min(state.currentSection + 1, 8),
        validationErrors: {},
      };
    });
  },

  previousSection: () => {
    set((state) => ({
      currentSection: Math.max(state.currentSection - 1, 0),
      validationErrors: {},
    }));
  },

  goToSection: (sectionIndex) => {
    if (sectionIndex >= 0 && sectionIndex <= 8) {
      set({
        currentSection: sectionIndex,
        validationErrors: {},
      });
    }
  },

  // ===== FORM UPDATES =====
  updateField: (field, value) => {
    set((state) => ({
      discovery: {
        ...state.discovery,
        [field]: value,
      },
    }));
  },

  /**
   * Enhanced nested path setter:
   * Handles root properties natively when string lacks dot delimiters.
   */
  updateNestedField: (path, value) => {
    set((state) => {
      const keys = path.split('.');
      let updated = { ...state.discovery };
      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return { discovery: updated };
    });
  },

  updateArrayField: (field, item, operation = 'add') => {
    set((state) => {
      const array = [...state.discovery[field]];
      if (operation === 'add') {
        array.push(item);
      } else if (operation === 'remove') {
        const index = array.findIndex((i) => i.id === item.id);
        if (index > -1) {
          array.splice(index, 1);
        }
      } else if (operation === 'update') {
        const index = array.findIndex((i) => i.id === item.id);
        if (index > -1) {
          array[index] = item;
        }
      }
      return {
        discovery: {
          ...state.discovery,
          [field]: array,
        },
      };
    });
  },

  addAISystem: () => {
    const newSystem = {
      id: `system-${Date.now()}`,
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
    };

    set((state) => ({
      discovery: {
        ...state.discovery,
        ai_ml_systems: [...state.discovery.ai_ml_systems, newSystem],
      },
    }));
  },

  updateAISystem: (systemId, updates) => {
    set((state) => ({
      discovery: {
        ...state.discovery,
        ai_ml_systems: state.discovery.ai_ml_systems.map((sys) =>
          sys.id === systemId ? { ...sys, ...updates } : sys
        ),
      },
    }));
  },

  removeAISystem: (systemId) => {
    set((state) => ({
      discovery: {
        ...state.discovery,
        ai_ml_systems: state.discovery.ai_ml_systems.filter((sys) => sys.id !== systemId),
      },
    }));
  },

  addVendor: () => {
    const newVendor = {
      id: `vendor-${Date.now()}`,
      name: '',
      type: '',
      data_access: [],
      security_assessment: 'pending',
      contract_dated: '',
      soc2_certified: false,
      breach_liability: false,
    };

    set((state) => ({
      discovery: {
        ...state.discovery,
        third_party_vendors: [...state.discovery.third_party_vendors, newVendor],
      },
    }));
  },

  updateVendor: (vendorId, updates) => {
    set((state) => ({
      discovery: {
        ...state.discovery,
        third_party_vendors: state.discovery.third_party_vendors.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, ...updates } : vendor
        ),
      },
    }));
  },

  removeVendor: (vendorId) => {
    set((state) => ({
      discovery: {
        ...state.discovery,
        third_party_vendors: state.discovery.third_party_vendors.filter(
          (vendor) => vendor.id !== vendorId
        ),
      },
    }));
  },

  toggleDataType: (dataType) => {
    set((state) => ({
      discovery: {
        ...state.discovery,
        data_types_processed: {
          ...state.discovery.data_types_processed,
          [dataType]: !state.discovery.data_types_processed[dataType],
        },
      },
    }));
  },

  toggleGeographicPresence: (region) => {
    set((state) => {
      const regions = state.discovery.geographic_presence.includes(region)
        ? state.discovery.geographic_presence.filter((r) => r !== region)
        : [...state.discovery.geographic_presence, region];

      return {
        discovery: {
          ...state.discovery,
          geographic_presence: regions,
        },
      };
    });
  },

  // ===== SUBMISSION PROMISES =====
  submitDiscovery: async (orgId, appStoreSubmit) => {
    const { discovery } = get();
    set({ isSubmitting: true });

    try {
      const result = await Promise.resolve(appStoreSubmit(orgId, discovery));
      set({
        isSubmitting: false,
        currentSection: 0,
        discovery: getCleanInitialState(),
      });
      return result;
    } catch (error) {
      set({ isSubmitting: false });
      throw error;
    }
  },

  // ===== UTILITIES =====
  reset: () => {
    set({
      currentSection: 0,
      discovery: getCleanInitialState(),
      validationErrors: {},
      isSubmitting: false,
    });
  },

  getProgress: () => {
    const { currentSection } = get();
    return Math.round(((currentSection + 1) / 9) * 100);
  },

  getSectionCompletion: () => {
    const { discovery } = get();
    const completion = {};

    completion[0] =
      discovery.org_size &&
      discovery.num_employees > 0 &&
      discovery.num_facilities > 0 &&
      discovery.geographic_presence.length > 0;

    completion[1] =
      discovery.systems_in_use.custom_applications > 0 ||
      discovery.systems_in_use.ehr_systems.length > 0 ||
      discovery.systems_in_use.cloud_providers.length > 0;

    completion[2] =
      discovery.skip_data_architecture ||
      (Object.values(discovery.data_types_processed).some((v) => v === true) &&
        discovery.data_flows.description.length > 0);

    completion[3] =
      discovery.skip_ai_systems ||
      (discovery.ai_ml_systems.length > 0 && discovery.ml_infrastructure.ml_platform);

    completion[4] =
      (discovery.access_control.rbac || discovery.access_control.abac) &&
      discovery.data_security.encryption_at_rest;

    completion[5] =
      Object.values(discovery.compliance_frameworks).some((f) => f.certified) &&
      (discovery.governance_structure.has_ciso ||
        discovery.governance_structure.has_dpo);

    completion[6] = true;
    completion[7] = true;
    completion[8] = true;

    return completion;
  },
}));

// ===== VALIDATION PIPELINE =====
function validateSection(sectionIndex, discovery) {
  const errors = {};

  switch (sectionIndex) {
    case 0:
      if (!discovery.org_size) errors.org_size = 'Required';
      if (!discovery.num_employees) errors.num_employees = 'Required';
      if (!discovery.num_facilities) errors.num_facilities = 'Required';
      if (discovery.geographic_presence.length === 0)
        errors.geographic_presence = 'Select at least one region';
      if (!discovery.primary_industry) errors.primary_industry = 'Required';
      break;

    case 1:
      if (
        discovery.systems_in_use.ehr_systems.length === 0 &&
        discovery.systems_in_use.cloud_providers.length === 0 &&
        discovery.systems_in_use.custom_applications === 0
      ) {
        errors.systems_in_use = 'Describe at least one system';
      }
      break;

    case 2:
      if (discovery.skip_data_architecture === true) {
        break;
      }
      if (!Object.values(discovery.data_types_processed).some((v) => v === true)) {
        errors.data_types = 'Select at least one data type';
      }
      if (discovery.data_flows.description.length < 10) {
        errors.data_flows = 'Describe your data flow (at least 10 characters)';
      }
      break;

    case 3:
      if (discovery.skip_ai_systems === true) {
        break;
      }
      if (discovery.ai_ml_systems.length === 0) {
        errors.ai_ml_systems = 'Add at least one AI/ML system or check skip options';
      } else {
        discovery.ai_ml_systems.forEach((sys) => {
          if (!sys.name) errors[`system_${sys.id}_name`] = 'System name required';
          if (!sys.input_data || sys.input_data.length === 0)
            errors[`system_${sys.id}_input`] = 'Select input data sources';
        });
      }
      break;

    case 4:
      if (!discovery.access_control.rbac && !discovery.access_control.abac) {
        errors.access_control = 'Describe your access control method';
      }
      if (!discovery.data_security.encryption_at_rest) {
        errors.encryption = 'Encryption at rest is critical';
      }
      break;

    case 5:
      if (!Object.values(discovery.compliance_frameworks).some((f) => f.certified)) {
        errors.compliance = 'Indicate which frameworks are applicable';
      }
      break;

    default:
      break;
  }

  return errors;
}