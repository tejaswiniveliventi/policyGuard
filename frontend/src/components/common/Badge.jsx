/**
 * components/common/Badge.jsx
 * 
 * Reusable badge/tag component for status and severity labels.
 * 
 * Props:
 * - variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
 * - size: 'sm' | 'md' | 'lg' (default: md)
 * - children: string or React node
 */

import React from 'react';
//import './Badge.css';

export default function Badge({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  ...props
}) {
  return (
    <span
      className={`badge badge-${variant} badge-${size} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
