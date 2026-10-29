import React from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { DAYS_7, ZONE_COLORS } from '../data/graphData';

const PERIODS = [
  { value: '24h', label: '24 jam', duration: 24 * 60 * 60 * 1000 },
  { value: '7d', label: '7 hari', duration: 7 * 24 * 60 * 60 * 1000 },
  { value: '30d', label: '30 hari', duration: 30 * 24 * 60 * 60 * 1000 },
  { value: '1y', label: '1 tahun', duration: 365 * 24 * 60 * 60 * 1000 },
];

const GRID_VALUES = [0, 20, 40, 60, 80, 100];

function normalizeZones(data) {
  return (Array.isArray(data) ? data : []).map(zone => {
    const rawHistory = Array.isArray(zone.moistureHistory) ? zone.moistureHistory : [];
    const timestamps = Array.isArray(zone.moistureHistoryTimestamps) ? zone.moistureHistoryTimestamps : [];
    const history = rawHistory.map((item, index) => {
      const value = typeof item === 'object' ? item.value ?? item.moisture : item;
      const timestamp = typeof item === 'object'
        ? item.timestamp ?? item.time ?? item.date ?? item.created_at ?? item.createdAt ?? item.recorded_at ?? item.recordedAt ?? item.measured_at ?? item.measuredAt
        : timestamps[index];
      return { value: Number(value), timestamp };
    }).filter(item => Number.isFinite(item.value)).map(item => ({ ...item, value: Math.max(0, Math.min(100, item.value)) }));
    return { ...zone, id: Number(zone.id), plant: zone.plant?.trim() || '', history };
  }).filter(zone => Number.isFinite(zone.id));
}

function zoneLabel(zone) { return `Zona ${zone.id}${zone.plant ? ` · ${zone.plant}` : ''}`; }
function formatValue(value) { return Number.isInteger(value) ? String(value) : value.toFixed(1); }
function parseTimestamp(value) { if (!value) return null; const time = new Date(value).getTime(); return Number.isFinite(time) ? time : null; }

function formatTimestamp(value, period) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const options = period === '24h'
    ? { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Makassar' }
    : period === '1y'
      ? { month: 'short', year: 'numeric', timeZone: 'Asia/Makassar' }
      : { weekday: 'short', day: '2-digit', month: 'short', timeZone: 'Asia/Makassar' };
  return new Intl.DateTimeFormat('id-ID', options).format(date).replace(':', '.');
}

function filterZones(zones, period) {
  const allTimes = zones.flatMap(zone => zone.history.map(item => parseTimestamp(item.timestamp)).filter(Boolean));
  const hasTimestamps = allTimes.length > 0 && zones.some(zone => zone.history.some(item => item.timestamp));
  if (!hasTimestamps) return { zones, hasTimestamps: false };
  const latest = Math.max(...allTimes);
  const selectedPeriod = PERIODS.find(item => item.value === period);
  const start = latest - (selectedPeriod?.duration || PERIODS[1].duration);
  return { hasTimestamps: true, zones: zones.map(zone => ({ ...zone, history: zone.history.filter(item => {
    const timestamp = parseTimestamp(item.timestamp);
    return timestamp !== null && timestamp >= start && timestamp <= latest;
  }) })) };
}

function buildTimeline(zones, hasTimestamps) {
  if (!hasTimestamps) return Array.from({ length: Math.max(0, ...zones.map(zone => zone.history.length)) }, (_, index) => ({ key: String(index), index }));
  return Array.from(new Set(zones.flatMap(zone => zone.history.map(item => parseTimestamp(item.timestamp)).filter(Boolean)))).sort((a, b) => a - b).map(timestamp => ({ key: String(timestamp), timestamp }));
}

function valuesForZone(zone, timeline, hasTimestamps) {
  return timeline.map(point => {
    if (!hasTimestamps) return zone?.history[point.index]?.value ?? null;
    const item = zone?.history.find(entry => parseTimestamp(entry.timestamp) === point.timestamp);
    return item?.value ?? null;
  });
}

function averageValues(series) {
  return series[0]?.map((_, index) => {
    const values = series.map(item => item[index]).filter(Number.isFinite);
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  }) || [];
}

function summaryFor(values) {
  const validValues = values.filter(Number.isFinite);
  if (!validValues.length) return null;
  return { average: validValues.reduce((sum, value) => sum + value, 0) / validValues.length, highest: Math.max(...validValues), lowest: Math.min(...validValues) };
}

// Monotone cubic interpolation changes only the path between measurements; dots and stats use raw values.
function monotonePath(values, xOf, yOf) {
  const points = values.map((value, index) => value === null ? null : ({ x: xOf(index), y: yOf(value) })).filter(Boolean);
  if (!points.length) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  const slopes = points.slice(0, -1).map((point, index) => (points[index + 1].y - point.y) / (points[index + 1].x - point.x));
  const tangents = [slopes[0]];
  for (let index = 1; index < points.length - 1; index += 1) tangents.push(slopes[index - 1] * slopes[index] <= 0 ? 0 : (slopes[index - 1] + slopes[index]) / 2);
  tangents.push(slopes[slopes.length - 1]);
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const dx = (points[index + 1].x - points[index].x) / 3;
    path += ` C ${points[index].x + dx} ${points[index].y + tangents[index] * dx}, ${points[index + 1].x - dx} ${points[index + 1].y - tangents[index + 1] * dx}, ${points[index + 1].x} ${points[index + 1].y}`;
  }
  return path;
}

function areaPath(values, xOf, yOf, bottom) {
  const line = monotonePath(values, xOf, yOf);
  const indexes = values.map((value, index) => value === null ? null : index).filter(index => index !== null);
  if (!line || !indexes.length) return '';
  return `${line} L ${xOf(indexes[indexes.length - 1])} ${bottom} L ${xOf(indexes[0])} ${bottom} Z`;
}

function ThresholdLines({ zone, yOf, xStart, xEnd }) {
  const min = Number(zone?.targetMoistureMin);
  const max = Number(zone?.targetMoistureMax);
  if (!zone || !Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max > 100 || min >= max) return null;
  return <g className="dashboard-thresholds" aria-label={`Ambang ${zoneLabel(zone)} ${min}% sampai ${max}%`}>
    <line x1={xStart} x2={xEnd} y1={yOf(min)} y2={yOf(min)} /><line x1={xStart} x2={xEnd} y1={yOf(max)} y2={yOf(max)} />
    <text x={xEnd - 2} y={yOf(max) - 4} textAnchor="end">Target {min}–{max}%</text>
  </g>;
}

export function DashboardMoistureChart({ data = [] }) {
  const [period, setPeriod] = React.useState('7d');
  const [mode, setMode] = React.useState('average');
  const [zoneId, setZoneId] = React.useState('all');
  const [hoverIndex, setHoverIndex] = React.useState(null);
  const zones = React.useMemo(() => normalizeZones(data).sort((a, b) => a.id - b.id), [data]);
  const filtered = React.useMemo(() => filterZones(zones, period), [zones, period]);
  const periodZones = filtered.zones.filter(zone => zone.history.length > 0);
  const selectedZone = periodZones.find(zone => String(zone.id) === String(zoneId));
  const focusedZone = selectedZone || periodZones[0];
  const displayZones = mode === 'zone'
    ? (zoneId === 'all' ? periodZones : (selectedZone ? [selectedZone] : []))
    : periodZones;
  const timeline = React.useMemo(() => buildTimeline(displayZones, filtered.hasTimestamps), [displayZones, filtered.hasTimestamps]);
  const seriesByZone = displayZones.map(zone => ({ zone, values: valuesForZone(zone, timeline, filtered.hasTimestamps) }));
  const averageSeries = averageValues(seriesByZone.map(item => item.values));
  const selectedValues = seriesByZone[0]?.values || [];
  const mainValues = mode === 'average' ? averageSeries : selectedValues;
  const summary = summaryFor(mode === 'average' || zoneId === 'all' ? seriesByZone.flatMap(item => item.values) : selectedValues);
  const W = 760, H = 300, pad = { left: 42, right: 18, top: 18, bottom: 44 };
  const plotWidth = W - pad.left - pad.right, plotHeight = H - pad.top - pad.bottom;
  const xOf = index => pad.left + (timeline.length <= 1 ? plotWidth / 2 : (index / (timeline.length - 1)) * plotWidth);
  const yOf = value => pad.top + ((100 - value) / 100) * plotHeight;
  const axisIndexes = timeline.map((_, index) => index).filter(index => timeline.length <= 7 || index === 0 || index === timeline.length - 1 || index % Math.ceil(timeline.length / 6) === 0);
  const hoveredPoint = timeline[hoverIndex ?? -1];
  const fallbackLabels = timeline.length === DAYS_7.length ? DAYS_7 : [];
  const selectedAxisLabel = filtered.hasTimestamps && hoveredPoint?.timestamp
    ? formatTimestamp(hoveredPoint.timestamp, period)
    : (fallbackLabels[hoverIndex ?? -1] || 'Waktu pengukuran belum tersedia dari API');
  const periodLabel = PERIODS.find(item => item.value === period)?.label;
  const supportsPeriod = filtered.hasTimestamps || period === '7d';
  const canRender = timeline.length > 0 && mainValues.some(Number.isFinite);

  React.useEffect(() => { setHoverIndex(null); }, [period, mode, zoneId]);

  function handlePointer(event, index) {
    const chart = event.currentTarget.closest('.dashboard-moisture-chart');
    const bounds = chart.getBoundingClientRect();
    setHoverIndex(index);
    chart.style.setProperty('--tooltip-x', `${event.clientX - bounds.left}px`);
    chart.style.setProperty('--tooltip-y', `${event.clientY - bounds.top}px`);
  }

  return <div className="dashboard-moisture-chart">
    <div className="dashboard-chart-header">
      <div><h2>Tren Kelembapan Tanah</h2><p>{supportsPeriod ? `${periodLabel} terakhir · histori sensor aktual` : `Data periode ${periodLabel} belum tersedia dari API`}</p></div>
      <div className="dashboard-chart-filters" aria-label="Filter grafik kelembapan">
        <label><span className="sr-only">Mode grafik</span><select value={mode} onChange={event => setMode(event.target.value)}><option value="average">Rata-rata Lahan</option><option value="zone">Per Zona</option></select><ChevronDown size={13} aria-hidden="true" /></label>
        <label><span className="sr-only">Periode</span><select value={period} onChange={event => setPeriod(event.target.value)}>{PERIODS.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select><ChevronDown size={13} aria-hidden="true" /></label>
        <label><span className="sr-only">Zona</span><select value={mode === 'average' ? 'all' : zoneId} onChange={event => setZoneId(event.target.value)} disabled={mode === 'average'}><option value="all">Semua Zona</option>{zones.map(zone => <option key={zone.id} value={zone.id}>{zoneLabel(zone)}</option>)}</select><ChevronDown size={13} aria-hidden="true" /></label>
      </div>
    </div>

    {!supportsPeriod && <div className="dashboard-chart-empty" role="status"><Info size={17} /><div><strong>Data historis belum mencukupi</strong><span>API belum menyediakan timestamp atau sampel yang cukup untuk periode {periodLabel}.</span></div></div>}
    {supportsPeriod && !canRender && <div className="dashboard-chart-empty" role="status"><Info size={17} /><div><strong>Data kelembapan belum tersedia</strong><span>Belum ada riwayat sensor yang dapat ditampilkan untuk pilihan ini.</span></div></div>}

    {supportsPeriod && canRender && <>
      <div className="dashboard-chart-canvas" onMouseLeave={() => setHoverIndex(null)} onPointerLeave={() => setHoverIndex(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Grafik ${mode === 'average' ? 'rata-rata lahan' : zoneLabel(focusedZone)} dalam persen`}>
          {GRID_VALUES.map(value => <g key={value}><line className="dashboard-grid-line" x1={pad.left} x2={W - pad.right} y1={yOf(value)} y2={yOf(value)} /><text className="dashboard-axis-label" x={pad.left - 8} y={yOf(value) + 4} textAnchor="end">{value}%</text></g>)}
          <ThresholdLines zone={mode === 'zone' ? selectedZone : null} yOf={yOf} xStart={pad.left} xEnd={W - pad.right} />
          {filtered.hasTimestamps
            ? axisIndexes.map(index => <text key={index} className="dashboard-axis-label" x={xOf(index)} y={H - 12} textAnchor="middle">{formatTimestamp(timeline[index].timestamp, period)}</text>)
            : fallbackLabels.length
              ? axisIndexes.map(index => <text key={index} className="dashboard-axis-label" x={xOf(index)} y={H - 12} textAnchor="middle">{fallbackLabels[index]}</text>)
              : <text className="dashboard-axis-label dashboard-axis-missing" x={W / 2} y={H - 12} textAnchor="middle">Waktu pengukuran belum tersedia dari API</text>}
          {mode === 'average' && <><path className="dashboard-series-area" d={areaPath(mainValues, xOf, yOf, yOf(0))} /><path className="dashboard-series-line dashboard-primary-line" d={monotonePath(mainValues, xOf, yOf)} />{mainValues.map((value, index) => Number.isFinite(value) && <circle key={index} className={`dashboard-series-point dashboard-primary-point ${hoverIndex === index ? 'active' : ''}`} cx={xOf(index)} cy={yOf(value)} r={hoverIndex === index ? 4 : 2.8} />)}</>}
          {mode === 'zone' && seriesByZone.map(({ zone, values }) => { const color = ZONE_COLORS[(zone.id - 1) % ZONE_COLORS.length]; return <g key={zone.id}><path className="dashboard-series-line dashboard-zone-line" d={monotonePath(values, xOf, yOf)} style={{ stroke: color }} />{values.map((value, index) => Number.isFinite(value) && <circle key={index} className={`dashboard-series-point dashboard-zone-point ${hoverIndex === index ? 'active' : ''}`} style={{ stroke: color }} cx={xOf(index)} cy={yOf(value)} r={hoverIndex === index ? 4 : 2.5} />)}</g>; })}
          {mode === 'zone' && zoneId === 'all' && <path className="dashboard-average-line" d={monotonePath(averageSeries, xOf, yOf)} />}
          {timeline.map((point, index) => <rect key={point.key} className="dashboard-hover-target" x={Math.max(pad.left, xOf(index) - plotWidth / Math.max(timeline.length, 2) / 2)} y={pad.top} width={plotWidth / Math.max(timeline.length, 2)} height={plotHeight} onPointerMove={event => handlePointer(event, index)} onFocus={() => setHoverIndex(index)} tabIndex={0} aria-label={`Lihat ${filtered.hasTimestamps ? formatTimestamp(point.timestamp, period) : `sampel ${index + 1}`}`} />)}
        </svg>
        {hoverIndex !== null && <div className="dashboard-chart-tooltip" role="status"><strong>{selectedAxisLabel}</strong>{mode === 'average' ? <><span><i />Rata-rata lahan <b>{Number.isFinite(mainValues[hoverIndex]) ? `${formatValue(mainValues[hoverIndex])}%` : '—'}</b></span><small>Rata-rata dari zona dengan data valid</small></> : seriesByZone.map(({ zone, values }) => Number.isFinite(values[hoverIndex]) && <span key={zone.id}><i style={{ background: ZONE_COLORS[(zone.id - 1) % ZONE_COLORS.length] }} />{zoneLabel(zone)} <b>{formatValue(values[hoverIndex])}%</b></span>)}</div>}
      </div>
      <div className="dashboard-chart-legend" aria-label="Legenda grafik">{mode === 'average' ? <><span className="primary-legend"><i />Rata-rata lahan</span><span className="average-legend"><i />Area transparan = tren rata-rata</span></> : <>{seriesByZone.map(({ zone }) => <span key={zone.id}><i style={{ background: ZONE_COLORS[(zone.id - 1) % ZONE_COLORS.length] }} />{zoneLabel(zone)}</span>)}{zoneId === 'all' && <span className="average-legend"><i />Rata-rata</span>}{zoneId !== 'all' && Number.isFinite(Number(selectedZone?.targetMoistureMin)) && Number.isFinite(Number(selectedZone?.targetMoistureMax)) && <span className="threshold-legend"><i />Ambang target</span>}</>}</div>
    </>}

    {summary && <div className="dashboard-chart-summary" aria-label="Ringkasan kelembapan"><div><span>Rata-rata</span><strong>{formatValue(summary.average)}%</strong></div><div><span>Tertinggi</span><strong>{formatValue(summary.highest)}%</strong></div><div><span>Terendah</span><strong>{formatValue(summary.lowest)}%</strong></div></div>}
  </div>;
}
