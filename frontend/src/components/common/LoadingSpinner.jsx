/**
 * components/common/LoadingSpinner.jsx
 * 
 * Reusable loading spinner component.
 * 
 * Props:
 * - size: 'sm' | 'md' | 'lg' (default: md)
 * - fullPage: boolean (overlay entire page)
 * - message: string (optional loading message)
 */

import React from 'react';
//import './LoadingSpinner.css';

export default function LoadingSpinner({
  size = 'md',
  fullPage = false,
  message = 'Loading...',
}) {
  const content = (
    <div className={`spinner spinner-${size}`}>
      <div className="spinner-ring"></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="spinner-fullpage">
        {content}
      </div>
    );
  }

  return content;
}
