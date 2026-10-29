import React from 'react';
import { ZONE_COLORS } from '../../data/graphData';

/**
 * Line chart SVG kelembapan – 9 zona + rata-rata.
 * Fitur: hover tooltip, legend, gridlines, animasi ringan.
 */
export function MoistureLineChart({ activeZones = 'all', data = [], labels = [] }) {
  const [tooltip, setTooltip] = React.useState(null);
  const [hoverDay, setHoverDay] = React.useState(null);

  const W = 700, H = 280;
  const pad = { l: 44, r: 20, t: 16, b: 36 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const gridVals = [0, 20, 40, 60, 80, 100];
  const days = labels;
  const hoverZoneWidth = days.length < 2 ? innerW : innerW / (days.length - 1);

  const xOf = i => pad.l + (days.length < 2 ? 0.5 : i / (days.length - 1)) * innerW;
  const yOf = v => pad.t + ((100 - v) / 100) * innerH;

  const isAllZones = activeZones === 'all';
  const activeZoneIds = Array.isArray(activeZones)
    ? new Set(activeZones.map(String))
    : null;

  // Filter series berdasarkan satu zona atau kumpulan zona hasil filter status.
  const liveSeries = data
    .filter(zone => Array.isArray(zone.moistureHistory) && zone.moistureHistory.some(Number.isFinite))
    .map(zone => ({
      zoneId: zone.id,
      label: zone.name || `Zona ${zone.id}`,
      data: zone.moistureHistory.map(value => value === null || value === undefined ? null : Number(value)),
    }));
  const sourceSeries = liveSeries;
  const series = isAllZones
    ? sourceSeries
    : sourceSeries.filter(z => activeZoneIds
      ? activeZoneIds.has(String(z.zoneId))
      : String(z.zoneId) === String(activeZones));
  const averageSource = series.length ? series : sourceSeries;
  const averageSeries = days.map((_, day) => {
    const values = averageSource.map(zone => zone.data[day]).filter(Number.isFinite);
    return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null;
  });
  const showAverage = isAllZones || series.length > 1;
  if (!series.length) return <div className="graphics-empty" role="status">Tidak ada data pada rentang tanggal ini</div>;

  // Build smooth polyline points
  function pts(data) {
    return data.map((v, i) => Number.isFinite(v) ? `${xOf(i)},${yOf(v)}` : null).filter(Boolean).join(' ');
  }

  // Area fill path
  function areaPath(data, color) {
    const points = data.map((v, i) => Number.isFinite(v) ? { x: xOf(i), y: yOf(v) } : null).filter(Boolean);
    if (!points.length) return '';
    const linePoints = points.map(point => `${point.x},${point.y}`).join(' L ');
    return `M ${points[0].x},${points[0].y} L ${linePoints} L ${points[points.length - 1].x},${H - pad.b} L ${points[0].x},${H - pad.b} Z`;
  }

  function handleMouseMove(e, dayIdx) {
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = Math.min(180, Math.max(140, rect.width - 16));
    const maxX = Math.max(8, rect.width - tooltipWidth);
    setHoverDay(dayIdx);
    setTooltip({
      x: Math.min(Math.max(e.clientX - rect.left + 14, 8), maxX),
      y: e.clientY - rect.top,
      day: days[dayIdx],
      values: series.filter(z => Number.isFinite(z.data[dayIdx])).map(z => ({ label: z.label, val: z.data[dayIdx], color: ZONE_COLORS[z.zoneId - 1] })),
      avg: averageSeries[dayIdx],
    });
  }

  return (
    <div className="chart-svg-wrap" style={{ position: 'relative' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="graph-svg"
        role="img"
        aria-label="Grafik kelembapan tanah semua zona"
        onMouseLeave={() => { setTooltip(null); setHoverDay(null); }}
      >
        {/* Grid lines Y */}
        {gridVals.map(v => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={yOf(v)} y2={yOf(v)}
              stroke={v === 0 ? '#d4ddd8' : '#edf2ef'} strokeWidth="1" />
            <text x={pad.l - 6} y={yOf(v) + 4} textAnchor="end" fontSize="9" fill="#95a8a0">{v}%</text>
          </g>
        ))}

        {/* Vertical day hover zones */}
        {days.map((d, i) => (
          <rect
            key={i}
            x={days.length < 2 ? pad.l : xOf(i) - hoverZoneWidth / 2}
            y={pad.t}
            width={hoverZoneWidth}
            height={innerH}
            fill="transparent"
            style={{ cursor: 'crosshair' }}
            onMouseMove={e => handleMouseMove(e, i)}
          />
        ))}

        {/* Hover day highlight */}
        {hoverDay !== null && (
          <line
            x1={xOf(hoverDay)} x2={xOf(hoverDay)}
            y1={pad.t} y2={H - pad.b}
            stroke="#c5d8cc" strokeWidth="1.5" strokeDasharray="4 3"
          />
        )}

        {/* Zone lines */}
        {series.map(z => {
          const color = ZONE_COLORS[z.zoneId - 1];
          return (
            <g key={z.zoneId}>
              {showAverage ? null : (
                <path d={areaPath(z.data, color)} fill={color} opacity="0.07" />
              )}
              <polyline
                points={pts(z.data)}
                fill="none"
                stroke={color}
                strokeWidth={activeZones === 'all' ? '1.8' : '2.5'}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                opacity="0.9"
              />
              {/* dots on hover day */}
              {hoverDay !== null && (
                <circle
                  cx={xOf(hoverDay)} cy={yOf(z.data[hoverDay])} r="4"
                  fill="#fff" stroke={color} strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </g>
          );
        })}

        {/* Average line */}
        {showAverage && tooltip && Number.isFinite(tooltip.avg) && (
          <polyline
            points={pts(averageSeries)}
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            strokeDasharray="6 3"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* X-axis labels */}
        {days.map((d, i) => (
          <text key={d} x={xOf(i)} y={H - 7} textAnchor="middle" fontSize="9" fill="#95a8a0">{d}</text>
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="chart-tooltip"
          style={{
            left: tooltip.x,
            top: Math.max(tooltip.y - 80, 8),
          }}
        >
          <div className="chart-tooltip-title">{tooltip.day}</div>
          {tooltip.values.slice(0, 5).map(v => (
            <div key={v.label} className="chart-tooltip-row">
              <i className="chart-tooltip-dot" style={{ background: v.color }} />
              <span>{v.label}</span>
              <strong>{v.val}%</strong>
            </div>
          ))}
          {tooltip.values.length > 5 && (
            <div className="chart-tooltip-more">+{tooltip.values.length - 5} lainnya...</div>
          )}
          {showAverage && (
            <div className="chart-tooltip-row" style={{ borderTop: '1px solid #e5ece8', marginTop: 4, paddingTop: 4 }}>
              <i className="chart-tooltip-dot" style={{ background: '#64748b' }} />
              <span>Rata-rata</span>
              <strong>{tooltip.avg}%</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Legend bawah chart kelembapan
 */
export function MoistureLegend({ activeZones, data = [] }) {
  const liveSeries = data
    .filter(zone => Array.isArray(zone.moistureHistory) && zone.moistureHistory.some(Number.isFinite))
    .map(zone => ({ zoneId: zone.id, label: zone.name || `Zona ${zone.id}` }));
  const sourceSeries = liveSeries;
  const isAllZones = activeZones === 'all';
  const activeZoneIds = Array.isArray(activeZones)
    ? new Set(activeZones.map(String))
    : null;
  const show = isAllZones
    ? sourceSeries
    : sourceSeries.filter(z => activeZoneIds
      ? activeZoneIds.has(String(z.zoneId))
      : String(z.zoneId) === String(activeZones));
  return (
    <div className="graph-legend">
      {show.map(z => (
        <span key={z.zoneId} className="graph-legend-item">
          <i style={{ background: ZONE_COLORS[z.zoneId - 1] }} className="graph-legend-dot" />
          {z.label}
        </span>
      ))}
      {(isAllZones || show.length > 1) && (
        <span className="graph-legend-item">
          <svg width="16" height="8" style={{ flexShrink: 0 }}>
            <line x1="0" y1="4" x2="16" y2="4" stroke="#64748b" strokeWidth="2" strokeDasharray="4 2" />
          </svg>
          Rata-rata
        </span>
      )}
    </div>
  );
}
