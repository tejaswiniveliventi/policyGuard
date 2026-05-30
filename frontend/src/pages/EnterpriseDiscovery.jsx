import React, { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useDiscoveryStore } from '../store/discoveryStore';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';
import { v4 as uuidv4 } from 'uuid';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Style imports
import '../styles/components.css';
import '../styles/variables.css';
import '../styles/EnterpriseDiscovery.css';

// Component section files
import Section0OrgOverview from '../components/discovery/Section0OrgOverview';
import Section1SystemInventory from '../components/discovery/Section1SystemInventory';
import Section2DataArchitecture from '../components/discovery/Section2DataArchitecture';
import Section3AIMLSystems from '../components/discovery/Section3AIMLSystems';
import Section4AccessSecurity from '../components/discovery/Section4AccessSecurity';
import Section5Compliance from '../components/discovery/Section5Compliance';
import Section6RiskManagement from '../components/discovery/Section6RiskManagement';
import Section7Vendors from '../components/discovery/Section7Vendors';
import Section8Maturity from '../components/discovery/Section8Maturity';

const SECTIONS = [
  { id: 0, title: 'Overview', icon: '🏢' },
  { id: 1, title: 'Inventory', icon: '💻' },
  { id: 2, title: 'Architecture', icon: '🗄️' },
  { id: 3, title: 'AI/ML Systems', icon: '🤖' },
  { id: 4, title: 'Security', icon: '🔐' },
  { id: 5, title: 'Compliance', icon: '✅' },
  { id: 6, title: 'Risk', icon: '⚠️' },
  { id: 7, title: 'Vendors', icon: '🤝' },
  { id: 8, title: 'Maturity', icon: '📈' },
];

export default function EnterpriseDiscovery() {
  const { organization, submitDiscovery: appSubmitDiscovery } = useAppStore();
  const {
    currentSection,
    discovery,
    isSubmitting,
    validationErrors,
    nextSection,
    previousSection,
    goToSection,
    getProgress,
    submitDiscovery: discoverySubmit,
  } = useDiscoveryStore();

  const handleNext = () => nextSection();
  const handlePrevious = () => previousSection();

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Fallback assignment prevents crashing if organization structure is missing
    const targetOrgId = organization?.id || "042cbf70-ae6a-4a45-8138-ced7e674f784";
    
    try {
      // Execute save state sequence
      await discoverySubmit(targetOrgId, appSubmitDiscovery);
      window.location.href = '/discovery';
    } catch (error) {
      console.error('Discovery submission failed:', error);
      alert('Failed to submit discovery. Please check network logs and try again.');
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0: return <Section0OrgOverview />;
      case 1: return <Section1SystemInventory />;
      case 2: return <Section2DataArchitecture />;
      case 3: return <Section3AIMLSystems />;
      case 4: return <Section4AccessSecurity />;
      case 5: return <Section5Compliance />;
      case 6: return <Section6RiskManagement />;
      case 7: return <Section7Vendors />;
      case 8: return <Section8Maturity />;
      default: return null;
    }
  };

  if (isSubmitting) {
    return (
      <MainLayout>
        <LoadingSpinner fullPage={true} message="Analyzing your environment..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="discovery-container">
        
        {/* Header Block */}
        <div className="discovery-header">
          <h1>Enterprise Discovery Assessment</h1>
          <p>Complete this assessment to receive a comprehensive compliance report and auto-generated policies.</p>
        </div>

        {/* Form Progress Indicator */}
        <div className="discovery-progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
          </div>
          <p className="progress-text">{Math.round(getProgress())}% Complete</p>
        </div>

        {/* Section Navigation Steps (Fixed isolated styles) */}
        <div className="discovery-section-nav">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`disc-nav-item ${currentSection === section.id ? 'active' : ''} ${currentSection > section.id ? 'completed' : ''}`}
              onClick={() => goToSection(section.id)}
              disabled={isSubmitting}
            >
              <span className="section-icon">{section.icon}</span>
              <span className="section-name">{section.title}</span>
            </button>
          ))}
        </div>

        {/* Working Viewport Context */}
        <div className="discovery-section-content">
          {renderSection()}

          {/* Validation Alerts */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="validation-errors">
              <h4>Please fix the following errors before continuing:</h4>
              <ul>
                {Object.entries(validationErrors).map(([key, error]) => (
                  <li key={key}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Dynamic Buttons Form Actions Row */}
        <div className="discovery-actions">
          <Button
            variant="secondary"
            className="button button-secondary"
            onClick={handlePrevious}
            disabled={currentSection === 0 || isSubmitting}
          >
            ← Previous
          </Button>

          {currentSection < 8 ? (
            <Button
              variant="primary"
              className="button button-primary"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next →
            </Button>
          ) : (
            <Button
              variant="success"
              className="button button-success"
              onClick={handleSubmit} // Triggers patched handler safely
              disabled={isSubmitting}
            >
              ✓ Submit Assessment
            </Button>
          )}
        </div>

        <div className="discovery-tips">
          <p>💡 <strong>Tip:</strong> All changes automatically persist into your local workspace state profile session.</p>
        </div>
      </div>
    </MainLayout>
  );
}