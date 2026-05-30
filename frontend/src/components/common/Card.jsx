/**
 * components/common/Card.jsx
 * 
 * Reusable card container component.
 * 
 * Props:
 * - title: string (optional header)
 * - subtitle: string
 * - header: React node (custom header)
 * - footer: React node
 * - variant: 'default' | 'elevated' | 'outlined' (default: default)
 * - children: React node
 */

import React from 'react';
//import './Card.css';

export default function Card({
  title,
  subtitle,
  header,
  footer,
  variant = 'default',
  children,
  className = '',
  ...props
}) {
  return (
    <div className={`card card-${variant} ${className}`} {...props}>
      {header && <div className="card-header-custom">{header}</div>}
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
