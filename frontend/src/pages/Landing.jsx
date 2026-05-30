/**
 * pages/Landing.jsx
 * 
 * Public landing page with:
 * - Hero section
 * - How-it-works (4 steps)
 * - Feature grid (6 cards)
 * - CTA buttons
 * 
 * Visible to unauthenticated users
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
//import './Landing.css';
import '../styles/settings.css';
import '../styles/components.css';
import '../styles/variables.css';
import '../styles/globals.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">🛡️ PolicyGuard</div>
        <div className="nav-buttons">
          <Button variant="secondary" onClick={() => navigate('/signin')}>
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <h1>AI-Powered Policy & Compliance Management</h1>
          <p>
            PolicyGuard empowers enterprises to adopt AI safely with real-time policy
            intelligence, automatic policy generation, and continuous compliance monitoring.
          </p>
          <div className="hero-buttons">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/signin')}
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => document.getElementById('how-it-works').scrollIntoView()}
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="hero-graphic">
          <div className="hero-icon">📊</div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="landing-how-it-works">
        <h2>How PolicyGuard Works</h2>
        <div className="how-it-works-grid">
          <div className="how-it-works-card">
            <div className="step-number">1</div>
            <h3>Discovery</h3>
            <p>
              Fill out our comprehensive enterprise discovery form covering systems,
              data, compliance, and AI/ML usage.
            </p>
          </div>

          <div className="how-it-works-card">
            <div className="step-number">2</div>
            <h3>Assessment</h3>
            <p>
              Our AI agents analyze your environment, scan repositories, and identify
              gaps against applicable regulations.
            </p>
          </div>

          <div className="how-it-works-card">
            <div className="step-number">3</div>
            <h3>Policy Generation</h3>
            <p>
              Automatically generate tailored policies for HIPAA, GDPR, SOX, and other
              frameworks based on your findings.
            </p>
          </div>

          <div className="how-it-works-card">
            <div className="step-number">4</div>
            <h3>Review & Approval</h3>
            <p>
              Review, modify, and approve policies through our enterprise dashboard.
              Audit trails track all changes.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <h2>Enterprise Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Real-Time Intelligence</h3>
            <p>
              Monitor regulatory changes and receive alerts when policies need updates.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Driven Policy Generation</h3>
            <p>
              Automatically generate compliant policies tailored to your specific
              environment and risk profile.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Comprehensive Compliance Dashboard</h3>
            <p>
              Track compliance status across HIPAA, GDPR, SOX, ISO 27001, and more from
              one central location.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Multi-Step Discovery</h3>
            <p>
              Exhaustive 9-section discovery form capturing systems, data, security,
              governance, and risk.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3>Integration Scanning</h3>
            <p>
              Automatic discovery of APIs, webhooks, data pipelines, and third-party
              integrations.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Audit & Accountability</h3>
            <p>
              Complete audit trail of all policy changes, approvals, and compliance
              actions for regulatory reviews.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <h2>Start Your AI Compliance Journey Today</h2>
        <p>
          Join hundreds of healthcare and enterprise organizations improving compliance
          with PolicyGuard.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/discovery')}
        >
          Begin Free Assessment
        </Button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 PolicyGuard. Privacy-first AI policy framework.</p>
      </footer>
    </div>
  );
}
