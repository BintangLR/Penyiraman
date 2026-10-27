import React from 'react';
import { WATERING_DATA } from '../../data/graphData';

/**
 * Combination chart: Bar (jumlah penyiraman) + Line (durasi menit)
 */
export function WateringCombinedChart() {
  const [tooltip, setTooltip] = React.useState(null);
  const { labels, count, duration } = WATERING_DATA;

  const W = 460, H = 220;
  const pad = { l: 36, r: 36, t: 16, b: 36 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const maxCount = Math.max(...count) + 2;
  const maxDur   = Math.max(...duration) + 20;

  const barW = innerW / labels.length * 0.45;
  const xOf  = i => pad.l + (i + 0.5) * (innerW / labels.length);
  const yCount = v => pad.t + ((maxCount - v) / maxCount) * innerH;
  const yDur   = v => pad.t + ((maxDur - v) / maxDur) * innerH;

  const durPts = duration.map((v, i) => `${xOf(i)},${yDur(v)}`).join(' ');

  return (
    <div style={{ position: 'relative' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="graph-svg"
        role="img"
        aria-label="Grafik penyiraman harian"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Grid Y kiri */}
        {[0, 2, 4, 6, 8].map(v => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={yCount(v)} y2={yCount(v)}
              stroke="#edf2ef" strokeWidth="1" />
            <text x={pad.l - 5} y={yCount(v) + 4} textAnchor="end" fontSize="8.5" fill="#95a8a0">{v}</text>
          </g>
        ))}

        {/* Grid Y kanan (durasi) */}
        {[0, 20, 40, 60, 80].map(v => (
          <text key={v} x={W - pad.r + 5} y={yDur(v) + 4} fontSize="8.5" fill="#f97316">{v}</text>
        ))}

        {/* Bars */}
        {count.map((v, i) => (
          <g key={i} onMouseMove={e => {
            const rect = e.currentTarget.closest('svg').getBoundingClientRect();
            setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, day: labels[i], count: v, dur: duration[i] });
          }}>
            <rect
              x={xOf(i) - barW / 2}
              y={yCount(v)}
              width={barW}
              height={innerH - yCount(v) + pad.t}
              rx="3"
              fill="#2878d6"
              opacity="0.75"
            />
          </g>
        ))}

        {/* Duration line */}
        <polyline
          points={durPts}
          fill="none"
          stroke="#f97316"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {duration.map((v, i) => (
          <circle key={i} cx={xOf(i)} cy={yDur(v)} r="3.5"
            fill="#fff" stroke="#f97316" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        ))}

        {/* X labels */}
        {labels.map((d, i) => (
          <text key={d} x={xOf(i)} y={H - 8} textAnchor="middle" fontSize="8.5" fill="#95a8a0">{d}</text>
        ))}

        {/* Y axis label left */}
        <text x={8} y={H / 2} textAnchor="middle" fontSize="8" fill="#2878d6"
          transform={`rotate(-90, 8, ${H / 2})`}>Jumlah</text>
        {/* Y axis label right */}
        <text x={W - 6} y={H / 2} textAnchor="middle" fontSize="8" fill="#f97316"
          transform={`rotate(90, ${W - 6}, ${H / 2})`}>Durasi (mnt)</text>
      </svg>

      {tooltip && (
        <div className="chart-tooltip" style={{ left: tooltip.x + 10, top: tooltip.y - 60 }}>
          <div className="chart-tooltip-title">{tooltip.day}</div>
          <div className="chart-tooltip-row">
            <i className="chart-tooltip-dot" style={{ background: '#2878d6' }} />
            <span>Penyiraman</span><strong>{tooltip.count}×</strong>
          </div>
          <div className="chart-tooltip-row">
            <i className="chart-tooltip-dot" style={{ background: '#f97316' }} />
            <span>Durasi</span><strong>{tooltip.dur} mnt</strong>
          </div>
        </div>
      )}

      <div className="graph-legend" style={{ marginTop: 8 }}>
        <span className="graph-legend-item">
          <i className="graph-legend-dot" style={{ background: '#2878d6', opacity: 0.75 }} />
          Jumlah Penyiraman
        </span>
        <span className="graph-legend-item">
          <i className="graph-legend-dot" style={{ background: '#f97316' }} />
          Durasi Penyiraman (menit)
        </span>
      </div>
    </div>
  );
}
