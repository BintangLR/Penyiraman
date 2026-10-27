import React from 'react';
import { DISTRIBUTION_DATA } from '../../data/graphData';

/**
 * Donut chart distribusi kondisi zona (SVG murni)
 */
export function ZoneDistributionChart({ data = DISTRIBUTION_DATA }) {
  const [hovered, setHovered] = React.useState(null);
  const total = data.reduce((a, d) => a + d.count, 0);
  const R = 60, r = 36; // outer & inner radius
  const cx = 90, cy = 80;

  // Build arcs
  let cumulative = 0;
  const slices = data.map(d => {
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += d.pct / 100;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + R * Math.cos(startAngle);
    const y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(endAngle);
    const y2 = cy + R * Math.sin(endAngle);
    const ix1 = cx + r * Math.cos(startAngle);
    const iy1 = cy + r * Math.sin(startAngle);
    const ix2 = cx + r * Math.cos(endAngle);
    const iy2 = cy + r * Math.sin(endAngle);
    const lg = d.pct > 50 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${lg} 0 ${ix1} ${iy1} Z`;
    return { ...d, path };
  });

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 180 160" className="donut-svg" role="img" aria-label="Distribusi kondisi zona">
        {slices.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill={s.color}
            opacity={hovered === null || hovered === i ? 1 : 0.5}
            style={{ cursor: 'pointer', transition: 'opacity .2s' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        {/* Center label */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20" fontWeight="800" fill="#17372b">{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#779185">Zona</text>
      </svg>

      {/* Legend */}
      <div className="donut-legend">
        {slices.map((s, i) => (
          <div
            key={i}
            className={`donut-legend-item${hovered === i ? ' active' : ''}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <i className="donut-legend-dot" style={{ background: s.color }} />
            <span className="donut-legend-label">{s.label}</span>
            <span className="donut-legend-pct">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
