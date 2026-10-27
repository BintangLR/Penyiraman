import React from 'react';
import { TEMPERATURE_DATA } from '../../data/graphData';

/**
 * Line chart suhu tanah 7 hari
 */
export function TemperatureChart() {
  const [tooltip, setTooltip] = React.useState(null);
  const { labels, values } = TEMPERATURE_DATA;

  const W = 460, H = 220;
  const pad = { l: 36, r: 16, t: 16, b: 36 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const minV = 15, maxV = 40;
  const xOf = i => pad.l + (i / (labels.length - 1)) * innerW;
  const yOf = v => pad.t + ((maxV - v) / (maxV - minV)) * innerH;

  const pts = values.map((v, i) => `${xOf(i)},${yOf(v)}`).join(' ');
  const area = `M ${xOf(0)},${yOf(values[0])} ` +
    values.slice(1).map((v, i) => `L ${xOf(i + 1)},${yOf(v)}`).join(' ') +
    ` L ${xOf(values.length - 1)},${H - pad.b} L ${xOf(0)},${H - pad.b} Z`;

  const gridTemps = [15, 20, 25, 30, 35, 40];

  return (
    <div style={{ position: 'relative' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="graph-svg"
        role="img"
        aria-label="Grafik suhu tanah"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Grids */}
        {gridTemps.map(v => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={yOf(v)} y2={yOf(v)}
              stroke="#edf2ef" strokeWidth="1" />
            <text x={pad.l - 5} y={yOf(v) + 4} textAnchor="end" fontSize="8.5" fill="#95a8a0">{v}°</text>
          </g>
        ))}

        {/* Area */}
        <path d={area} fill="rgba(245,158,11,0.09)" />

        {/* Line */}
        <polyline points={pts} fill="none" stroke="#f59e0b" strokeWidth="2.5"
          strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

        {/* Dots + hover zones */}
        {values.map((v, i) => (
          <g key={i}
            onMouseMove={e => {
              const rect = e.currentTarget.closest('svg').getBoundingClientRect();
              setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, day: labels[i], val: v });
            }}
          >
            <circle cx={xOf(i)} cy={yOf(v)} r="14" fill="transparent" />
            <circle cx={xOf(i)} cy={yOf(v)} r="4"
              fill="#fff" stroke="#f59e0b" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </g>
        ))}

        {/* X labels */}
        {labels.map((d, i) => (
          <text key={d} x={xOf(i)} y={H - 8} textAnchor="middle" fontSize="8.5" fill="#95a8a0">{d}</text>
        ))}
      </svg>

      {tooltip && (
        <div className="chart-tooltip" style={{ left: tooltip.x + 10, top: tooltip.y - 50 }}>
          <div className="chart-tooltip-title">{tooltip.day}</div>
          <div className="chart-tooltip-row">
            <i className="chart-tooltip-dot" style={{ background: '#f59e0b' }} />
            <span>Suhu Tanah</span><strong>{tooltip.val}°C</strong>
          </div>
        </div>
      )}

      <div className="graph-legend" style={{ marginTop: 8 }}>
        <span className="graph-legend-item">
          <i className="graph-legend-dot" style={{ background: '#f59e0b' }} />
          Suhu Tanah Rata-rata (°C)
        </span>
      </div>
    </div>
  );
}
