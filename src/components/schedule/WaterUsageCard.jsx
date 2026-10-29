import React from 'react';
const COLORS = ['#10a67a', '#e55353', '#2878d6', '#f59e0b', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899', '#84cc16'];

/** Card penggunaan air hari ini — sidebar kanan */
export function WaterUsageCard({ history = [] }) {
  const rows = Array.isArray(history) ? history : [];
  const usage = Object.values(rows.reduce((result, row) => {
    const key = row.zoneId || row.zoneName;
    if (!result[key]) result[key] = { zoneId: row.zoneId, zoneName: row.zoneName, used: 0 };
    result[key].used += Number(row.waterVolume || 0);
    return result;
  }, {})).sort((a, b) => Number(a.zoneId) - Number(b.zoneId));
  const totalUsed = usage.reduce((sum, zone) => sum + zone.used, 0);
  const totalEstimated = Math.max(totalUsed, 1);
  const pct = Math.min(100, Math.round((totalUsed / totalEstimated) * 100));

  return (
    <div className="graph-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <h2 className="graph-card-title">Penggunaan Air Hari Ini</h2>
        <span className="period-badge">Hari ini</span>
      </div>

      {/* Big number */}
      <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-.05em', color: '#17372b', marginBottom: 2 }}>
        {totalUsed.toLocaleString('id-ID')} <span style={{ fontSize: 14, fontWeight: 600, color: '#779185' }}>Liter</span>
      </div>
      <div style={{ fontSize: 10, color: '#779185', marginBottom: 10 }}>
        total penggunaan dari riwayat database
      </div>

      {/* Progress bar */}
      <div className="water-progress-bg">
        <div className="water-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div style={{ fontSize: 10, color: '#11855f', fontWeight: 800, textAlign: 'right', marginTop: 4, marginBottom: 14 }}>
        {pct}%
      </div>

      {/* Per-zone list */}
      <div className="water-zone-list">
        {usage.map((z, index) => (
          <div key={z.zoneId} className="water-zone-row">
            <span className="water-zone-dot" style={{ background: COLORS[index % COLORS.length] }} />
            <span className="water-zone-name">{z.zoneName}</span>
            <span className="water-zone-val">{z.used} L</span>
          </div>
        ))}
      </div>
    </div>
  );
}
