import React from 'react';
import { KPI_DATA } from '../../data/graphData';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * 4 KPI card: Kelembapan, Penyiraman, Air, Durasi
 */
export function KpiCards({ data = KPI_DATA }) {
  return (
    <div className="kpi-grid">
      {data.map(kpi => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}

function KpiCard({ kpi }) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon">{kpi.icon}</div>
      <div className="kpi-body">
        <div className="kpi-value">{kpi.value}</div>
        <div className="kpi-label">{kpi.label}</div>
        <div className="kpi-change">
          <span className={kpi.up ? 'kpi-change-up' : 'kpi-change-down'}>
            {kpi.up ? <TrendingUp size={10} strokeWidth={2} /> : <TrendingDown size={10} strokeWidth={2} />} {kpi.change}
          </span>
          <span className="kpi-sub">{kpi.sub}</span>
        </div>
      </div>
    </div>
  );
}
