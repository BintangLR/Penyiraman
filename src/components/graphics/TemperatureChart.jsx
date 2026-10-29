import React from 'react';
import { safeTimezone } from '../../services/preferences';

function formatLabel(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: safeTimezone(localStorage.getItem('ics-timezone')) }).format(date);
}

export function TemperatureChart({ data = [] }) {
  const [tooltip, setTooltip] = React.useState(null);
  const points = data.map(item => ({ label: formatLabel(item.measuredAt), value: Number(item.value) })).filter(item => Number.isFinite(item.value));
  if (!points.length) return <div className="graphics-empty" role="status">Tidak ada data suhu bertanggal pada rentang ini. Suhu terkini tersedia pada kartu zona.</div>;
  const W = 460, H = 220; const pad = { l: 36, r: 16, t: 16, b: 36 }; const innerW = W - pad.l - pad.r; const innerH = H - pad.t - pad.b;
  const minV = Math.min(15, ...points.map(p => p.value)); const maxV = Math.max(40, ...points.map(p => p.value));
  const xOf = i => pad.l + (points.length < 2 ? 0.5 : i / (points.length - 1)) * innerW; const yOf = v => pad.t + ((maxV - v) / Math.max(1, maxV - minV)) * innerH;
  const linePoints = points.map((p, i) => `${xOf(i)},${yOf(p.value)}`).join(' ');
  const area = `M ${xOf(0)},${yOf(points[0].value)} L ${linePoints} L ${xOf(points.length - 1)},${H - pad.b} L ${xOf(0)},${H - pad.b} Z`;
  const gridTemps = Array.from({ length: 6 }, (_, i) => minV + ((maxV - minV) * i) / 5);
  return <div style={{ position: 'relative' }}>
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="graph-svg" role="img" aria-label="Grafik suhu tanah" onMouseLeave={() => setTooltip(null)}>
      {gridTemps.map(v => <g key={v}><line x1={pad.l} x2={W - pad.r} y1={yOf(v)} y2={yOf(v)} stroke="#edf2ef" strokeWidth="1" /><text x={pad.l - 5} y={yOf(v) + 4} textAnchor="end" fontSize="8.5" fill="#95a8a0">{Math.round(v)}°</text></g>)}
      <path d={area} fill="rgba(245,158,11,0.09)" />
      <polyline points={linePoints} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {points.map((point, i) => <g key={`${point.label}-${i}`} onMouseMove={e => { const rect=e.currentTarget.closest('svg').getBoundingClientRect(); setTooltip({x:e.clientX-rect.left,y:e.clientY-rect.top,...point}); }}><circle cx={xOf(i)} cy={yOf(point.value)} r="14" fill="transparent" /><circle cx={xOf(i)} cy={yOf(point.value)} r="4" fill="#fff" stroke="#f59e0b" strokeWidth="2" vectorEffect="non-scaling-stroke" /></g>)}
      {points.map((point, i) => <text key={`label-${i}`} x={xOf(i)} y={H - 8} textAnchor="middle" fontSize="8.5" fill="#95a8a0">{point.label}</text>)}
    </svg>
    {tooltip && <div className="chart-tooltip" style={{ left: tooltip.x + 10, top: tooltip.y - 50 }}><div className="chart-tooltip-title">{tooltip.label}</div><div className="chart-tooltip-row"><i className="chart-tooltip-dot" style={{ background: '#f59e0b' }} /><span>Suhu Tanah</span><strong>{tooltip.value}°C</strong></div></div>}
    <div className="graph-legend" style={{ marginTop: 8 }}><span className="graph-legend-item"><i className="graph-legend-dot" style={{ background: '#f59e0b' }} />Suhu Tanah (°C)</span></div>
  </div>;
}
