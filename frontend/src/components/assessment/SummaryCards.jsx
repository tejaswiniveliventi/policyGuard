/**
 * components/assessment/SummaryCards.jsx
 * 
 * Display 4 key metrics from assessment:
 * - Critical findings count
 * - High findings count
 * - Medium findings count
 * - Estimated effort (days)
 * 
 * Props:
 * - findings: array of finding objects
 * - estimatedEffort: number (total days)
 */

import React from 'react';
import KPICard from '../dashboard/KPICard';
import '../../styles/components.css';

export default function SummaryCards({ findings = [], estimatedEffort = 0 }) {
  const criticalCount = findings.filter((f) => f.severity === 'critical').length;
  const highCount = findings.filter((f) => f.severity === 'high').length;
  const mediumCount = findings.filter((f) => f.severity === 'medium').length;

  const kpis = [
    {
      label: 'Critical Findings',
      value: criticalCount,
      status: criticalCount > 0 ? 'critical' : 'success',
      icon: '🔴',
    },
    {
      label: 'High Risk',
      value: highCount,
      status: highCount > 0 ? 'warning' : 'success',
      icon: '🟠',
    },
    {
      label: 'Medium Risk',
      value: mediumCount,
      status: mediumCount > 2 ? 'warning' : 'success',
      icon: '🟡',
    },
    {
      label: 'Est. Effort',
      value: `${estimatedEffort}d`,
      status: estimatedEffort > 10 ? 'warning' : 'success',
      icon: '⏱️',
    },
  ];

  return (
    <div className="summary-cards-container">
      {kpis.map((kpi, idx) => (
        <KPICard key={idx} {...kpi} />
      ))}
    </div>
  );
}
