/**
 * pages/NotFound.jsx
 * 
 * 404 Not Found page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import '../styles/components.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-icon">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>

        <div className="notfound-actions">
          <Button variant="primary" size="lg" onClick={() => navigate('/')}>
            ← Go Home
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard →
          </Button>
        </div>
      </div>
    </div>
  );
}
