import React from 'react';

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

/**
 * Grafik kelembapan 7 hari terakhir menggunakan SVG murni.
 * Tidak memerlukan library eksternal.
 */
export function MoistureChart({ history, zoneName, status }) {
  const W = 540, H = 180;
  const pad = { l: 38, r: 16, t: 16, b: 32 };

  const min = 0, max = 100;
  const x = i => pad.l + (i * (W - pad.l - pad.r)) / (history.length - 1);
  const y = v => pad.t + ((max - v) * (H - pad.t - pad.b)) / (max - min);

  const lineColor = status === 'Kering' ? '#e55353' : status === 'Basah' ? '#2878d6' : '#10a67a';
  const fillColor = status === 'Kering' ? 'rgba(229,83,83,.08)' : status === 'Basah' ? 'rgba(40,120,214,.08)' : 'rgba(16,166,122,.08)';

  const pts = history.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const areaPath = `M${x(0)},${y(history[0])} ` +
    history.slice(1).map((v, i) => `L${x(i + 1)},${y(v)}`).join(' ') +
    ` L${x(history.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`;

  const gridLines = [20, 40, 60, 80];
  const today = history[history.length - 1];

  return (
    <div className="detail-card">
      <div className="detail-card-header" style={{ marginBottom: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 750, letterSpacing: '-.02em' }}>
            Grafik Kelembapan
          </h3>
          <p style={{ margin: '3px 0 0', fontSize: 10, color: '#779185' }}>
            {zoneName} · 7 hari terakhir
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: lineColor, letterSpacing: '-.04em' }}>
            {today}%
          </div>
          <div style={{ fontSize: 9, color: '#779185' }}>Hari ini</div>
        </div>
      </div>

      <div className="chart-wrap">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="chart-svg"
          role="img"
          aria-label={`Grafik kelembapan ${zoneName} selama 7 hari terakhir`}
        >
          {/* Grid */}
          {gridLines.map(v => (
            <g key={v}>
              <line
                x1={pad.l} x2={W - pad.r}
                y1={y(v)} y2={y(v)}
                stroke="#e9efeb" strokeWidth="1"
              />
              <text x={4} y={y(v) + 4} fontSize="9" fill="#8ea397">{v}%</text>
            </g>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill={fillColor} />

          {/* Line */}
          <polyline
            points={pts}
            fill="none"
            stroke={lineColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Dots */}
          {history.map((v, i) => (
            <circle
              key={i}
              cx={x(i)} cy={y(v)} r="3.5"
              fill="#fff" stroke={lineColor} strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* X-axis labels */}
          {DAYS.map((d, i) => (
            <text
              key={d}
              x={x(i)} y={H - 7}
              textAnchor="middle"
              fontSize="9"
              fill="#8ea397"
            >
              {d}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
