/**
 * components/dashboard/KPICard.jsx
 * 
 * Display a single KPI metric with value, trend, and status.
 * 
 * Props:
 * - label: string (metric name)
 * - value: number or string
 * - trend: number (percentage change)
 * - trendUp: boolean (is trend positive?)
 * - status: 'critical' | 'warning' | 'success' | 'neutral' (default: neutral)
 * - icon: string (emoji or icon)
 * - onClick: function (optional click handler)
 */

import React from 'react';
import './KPICard.css';

export default function KPICard({
  label,
  value,
  trend,
  trendUp = true,
  status = 'neutral',
  icon,
  onClick,
}) {
  const trendIcon = trendUp ? '📈' : '📉';
  const trendClass = trendUp ? 'trend-up' : 'trend-down';

  return (
    <div
      className={`kpi-card kpi-status-${status}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="kpi-header">
        {icon && <span className="kpi-icon">{icon}</span>}
        <span className="kpi-label">{label}</span>
      </div>

      <div className="kpi-value">{value}</div>

      {trend !== undefined && (
        <div className={`kpi-trend ${trendClass}`}>
          <span className="trend-icon">{trendIcon}</span>
          <span className="trend-text">{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );
}
