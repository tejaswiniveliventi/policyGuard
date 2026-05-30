/**
 * components/dashboard/KPIGrid.jsx
 * 
 * Grid container for displaying multiple KPI cards.
 * 
 * Props:
 * - kpis: array of KPI objects
 * - columns: number (default: 4)
 */

import React from 'react';
import KPICard from './KPICard';
//import './KPIGrid.css';

export default function KPIGrid({ kpis, columns = 4 }) {
  return (
    <div
      className="kpi-grid"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
      }}
    >
      {kpis.map((kpi, index) => (
        <KPICard
          key={index}
          label={kpi.label}
          value={kpi.value}
          trend={kpi.trend}
          trendUp={kpi.trendUp}
          status={kpi.status}
          icon={kpi.icon}
          onClick={kpi.onClick}
        />
      ))}
    </div>
  );
}
