import React from 'react';
import { KpiCards } from '../components/graphics/KpiCards';
import { MoistureLineChart, MoistureLegend } from '../components/graphics/MoistureLineChart';
import { WateringCombinedChart } from '../components/graphics/WateringCombinedChart';
import { ZoneStatistics } from '../components/graphics/ZoneStatistics';
import { WateringHistoryTable } from '../components/graphics/WateringHistoryTable';
import { TemperatureChart } from '../components/graphics/TemperatureChart';
import { GraphicsFilter } from '../components/graphics/GraphicsFilter';
import { DateRangePicker } from '../components/graphics/DateRangePicker';
import { ZONES_SUMMARY } from '../data/graphData';
import { useApi } from '../services/api';
import { safeTimezone } from '../services/preferences';
import { Download, Check } from 'lucide-react';

const MONTHS = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
  mei: 4, may: 4, jun: 5, june: 5, jul: 6, july: 6, agu: 7, agustus: 7, aug: 7, august: 7,
  sep: 8, sept: 8, september: 8, okt: 9, october: 9, oct: 9, nov: 10, november: 10, des: 11, dec: 11, december: 11,
};

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseLocalDate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  const text = String(value).trim();
  const isoDate = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
  if (isoDate) {
    const date = new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const localized = text.match(/^(\d{1,2})\s+([A-Za-zÀ-ÿ.]+)\s+(\d{4})$/);
  if (localized) {
    const month = MONTHS[localized[2].replace('.', '').toLowerCase()];
    if (month === undefined) return null;
    const date = new Date(Number(localized[3]), month, Number(localized[1]));
    return date.getMonth() === month && date.getDate() === Number(localized[1]) ? date : null;
  }
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: safeTimezone(localStorage.getItem('ics-timezone')) }).format(date);
}

function dateLabelsBetween(startDate, endDate) {
  const dates = [];
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  while (cursor <= endDate) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

const DUMMY_GRAPH_START = new Date(2025, 8, 14);
const DUMMY_GRAPH_END = new Date(2025, 8, 20);

function isWithinRange(date, start, end) {
  return date >= start && date <= end;
}

function dummyDate(index) {
  const date = new Date(DUMMY_GRAPH_START);
  date.setDate(date.getDate() + index);
  return date;
}

function getDatedMoisturePoints(zones) {
  return zones.flatMap(zone => {
    const history = Array.isArray(zone.moistureHistoryPoints) ? zone.moistureHistoryPoints : (Array.isArray(zone.moistureHistory) ? zone.moistureHistory : []);
    const timestamps = Array.isArray(zone.moistureHistoryTimestamps) ? zone.moistureHistoryTimestamps : [];
    return history.flatMap((item, index) => {
      const value = Number(typeof item === 'object' ? item.value ?? item.moisture : item);
      const timestamp = typeof item === 'object'
        ? item.timestamp ?? item.time ?? item.date ?? item.created_at ?? item.createdAt ?? item.recorded_at ?? item.recordedAt ?? item.measured_at ?? item.measuredAt
        : timestamps[index];
      const date = parseLocalDate(timestamp);
      return date && Number.isFinite(value) ? [{ zoneId: String(zone.id), date, value }] : [];
    });
  });
}

function getUndatedMoistureSeries(zones) {
  return zones.map(zone => ({
    ...zone,
    moistureHistory: (Array.isArray(zone.moistureHistory) ? zone.moistureHistory : [])
      .map(item => Number(typeof item === 'object' ? item.value : item))
      .map(value => Number.isFinite(value) ? value : null),
  })).filter(zone => zone.moistureHistory.some(Number.isFinite));
}

/**
 * Halaman Grafik Kelembapan — monitoring visual lengkap.
 */
export function GraphicsPage({ onSelectZone, onNavigate }) {
  const [activeZoneSel, setActiveZoneSel] = React.useState('all');
  const [dateRange, setDateRange] = React.useState(() => {
    return { start: new Date(DUMMY_GRAPH_START), end: new Date(DUMMY_GRAPH_END) };
  });
  const toUtcBoundary = (date, end = false) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + (end ? 1 : 0)).toISOString();
  const graphicsPath = `/graphics-data?start=${encodeURIComponent(toUtcBoundary(dateRange.start))}&end=${encodeURIComponent(toUtcBoundary(dateRange.end, true))}${activeZoneSel !== 'all' ? `&zoneId=${encodeURIComponent(activeZoneSel)}` : ''}`;
  const { data: graphicsData = {}, error: graphicsError } = useApi(graphicsPath, { moisture: [], temperature: [] });
  const { data: dummyGraphics = {}, error: dummyGraphicsError } = useApi('/graphics', {});
  const graphics = graphicsData || {};
  const { data: history = [], error: historyError } = useApi('/history', []);
  const { data: liveZones = [] } = useApi('/zones', []);
  const zones = liveZones.length ? liveZones : (graphics.ZONES_SUMMARY || ZONES_SUMMARY);
  const zoneSelectOptions = [
    { value: 'all', label: 'Semua Zona' },
    ...zones.map(z => ({ value: String(z.id), label: `${z.name} – ${z.plant}` })),
  ];
  const zoneTabs = [
    { key: 'all', label: 'Semua Zona', count: zones.length },
    { key: 'kering', label: 'Zona Kering', count: zones.filter(z => (z.status || z.state) === 'Kering').length },
    { key: 'normal', label: 'Zona Normal', count: zones.filter(z => (z.status || z.state) === 'Normal').length },
    { key: 'basah', label: 'Zona Basah', count: zones.filter(z => (z.status || z.state) === 'Basah').length },
  ];
  // Filter state
  const [activeTab,    setActiveTab]    = React.useState('all');
  const [exportNote,   setExportNote]   = React.useState(false);
  const [filterMobile, setFilterMobile] = React.useState(false);
  // Chart filter state
  const [filters, setFilters] = React.useState({
    period:   '7d',
    dataType: 'moisture',
    zone:     'all',
  });
  const [appliedFilters, setAppliedFilters] = React.useState({ ...filters });

  function handleFilterChange(key, val) {
    setFilters(prev => ({ ...prev, [key]: val }));
  }
  function handleApplyFilter() {
    setAppliedFilters({ ...filters });
    const end = dateRange.end;
    const days = Number.parseInt(filters.period, 10);
    if (Number.isFinite(days)) {
      const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - days + 1);
      setDateRange({ start, end });
    }
    if (filters.zone !== 'all') {
      setActiveTab('all');
      setActiveZoneSel(filters.zone);
    } else {
      setActiveZoneSel('all');
    }
  }

  function selectStatusFilter(status) {
    setActiveTab(status);
    setActiveZoneSel('all');
    setFilters(prev => ({ ...prev, zone: 'all' }));
    setAppliedFilters(prev => ({ ...prev, zone: 'all' }));
  }

  function selectZoneFilter(zoneId) {
    setActiveTab('all');
    setActiveZoneSel(zoneId);
    setFilters(prev => ({ ...prev, zone: zoneId }));
    setAppliedFilters(prev => ({ ...prev, zone: zoneId }));
  }

  const startKey = localDateKey(dateRange.start);
  const endKey = localDateKey(dateRange.end);
  const rangeHistory = history.filter(row => {
    const date = parseLocalDate(row.date);
    if (!date) return false;
    const key = localDateKey(date);
    return key >= startKey && key <= endKey;
  });
  const dateLabels = dateLabelsBetween(dateRange.start, dateRange.end);
  const liveMoisturePoints = (graphicsData.moisture || []).map(point => ({ zoneId: String(point.zoneId), date: new Date(point.measuredAt), value: Number(point.value), source: 'database' })).filter(point => !Number.isNaN(point.date.getTime()) && Number.isFinite(point.value));
  const dummyMoisturePoints = (dummyGraphics.MOISTURE_HISTORY || []).flatMap(zone => (zone.data || []).map((value, index) => ({ zoneId: String(zone.zoneId), date: dummyDate(index), value: Number(value), source: 'app_data.graphics' })));
  const useDummyMoisture = liveMoisturePoints.length === 0 && isWithinRange(DUMMY_GRAPH_START, dateRange.start, dateRange.end) && isWithinRange(DUMMY_GRAPH_END, dateRange.start, dateRange.end);
  const moisturePoints = (useDummyMoisture ? dummyMoisturePoints : liveMoisturePoints)
    .filter(point => activeZoneSel === 'all' || point.zoneId === String(activeZoneSel));
  const moistureDates = [...new Set(moisturePoints.map(point => localDateKey(point.date)))].sort();
  const legacyMoistureCount = zones.reduce((sum, zone) => sum + (Array.isArray(zone.moistureHistory) ? zone.moistureHistory.length : 0), 0);
  const moistureChartZones = zones.map(zone => ({
    ...zone,
    moistureHistory: moistureDates.map(date => {
      const values = moisturePoints.filter(point => point.zoneId === String(zone.id) && localDateKey(point.date) === date).map(point => point.value);
      return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
    }),
  }));
  const chartMoistureLabels = moistureDates.map(date => formatShortDate(parseLocalDate(date)));
  const rangeMoistureValues = moisturePoints.map(point => point.value);
  const temperatureByTime = new Map();
  (graphicsData.temperature || []).forEach(point => { const key = point.measuredAt; const values = temperatureByTime.get(key) || []; values.push(Number(point.value)); temperatureByTime.set(key, values); });
  let temperaturePoints = [...temperatureByTime.entries()].map(([measuredAt, values]) => ({ measuredAt, value: values.reduce((sum, value) => sum + value, 0) / values.length, source: 'database' })).sort((a, b) => new Date(a.measuredAt) - new Date(b.measuredAt));
  const dummyTemperaturePoints = (dummyGraphics.TEMPERATURE_DATA?.values || []).map((value, index) => ({ measuredAt: `${dummyDate(index).toISOString().slice(0, 10)}T12:00:00.000Z`, value: Number(value), source: 'app_data.graphics' }));
  const useDummyTemperature = temperaturePoints.length === 0 && isWithinRange(DUMMY_GRAPH_START, dateRange.start, dateRange.end) && isWithinRange(DUMMY_GRAPH_END, dateRange.start, dateRange.end);
  if (useDummyTemperature) temperaturePoints = dummyTemperaturePoints;
  const dummyWatering = (dummyGraphics.WATERING_DATA?.count || []).map((count, index) => ({ label: formatShortDate(dummyDate(index)), count: Number(count), duration: Number(dummyGraphics.WATERING_DATA?.duration?.[index] || 0), source: 'app_data.graphics' }));
  const useDummyWatering = dummyWatering.length > 0 && isWithinRange(DUMMY_GRAPH_START, dateRange.start, dateRange.end) && isWithinRange(DUMMY_GRAPH_END, dateRange.start, dateRange.end);
  const dailyWatering = useDummyWatering ? dummyWatering : dateLabels.map(date => {
    const key = localDateKey(date);
    const records = rangeHistory.filter(row => {
      const rowDate = parseLocalDate(row.date);
      return rowDate && localDateKey(rowDate) === key;
    });
    const completedRecords = records.filter(row => String(row.status).toLowerCase() === 'selesai');
    return {
      label: formatShortDate(date),
      count: completedRecords.length,
      duration: completedRecords.reduce((sum, row) => sum + Number(row.duration || 0), 0),
    };
  });
  const completedHistory = rangeHistory.filter(row => String(row.status).toLowerCase() === 'selesai');
  const wateringHasRecords = useDummyWatering ? dailyWatering.some(day => day.count > 0 || day.duration > 0) : completedHistory.length > 0;
  const totalWater = completedHistory.reduce((sum, row) => sum + Number(row.waterVolume || 0), 0);
  const totalDuration = completedHistory.reduce((sum, row) => sum + Number(row.duration || 0), 0);
  const averageMoisture = rangeMoistureValues.length
    ? Math.round(rangeMoistureValues.reduce((sum, value) => sum + value, 0) / rangeMoistureValues.length)
    : null;
  const kpiData = [
    { id: 'humidity', icon: '💧', label: 'Rata-rata Kelembapan', value: averageMoisture === null ? '—' : `${averageMoisture}%`, change: 'Rentang terpilih', up: true, sub: averageMoisture === null ? 'Tidak ada data sensor bertanggal' : (useDummyMoisture ? 'Data dummy app_data.graphics' : 'Dari histori sensor') },
    { id: 'watering', icon: '🚿', label: 'Total Penyiraman', value: `${completedHistory.length} kali`, change: 'Rentang terpilih', up: true, sub: 'Status Selesai' },
    { id: 'water', icon: '🪣', label: 'Total Air Digunakan', value: `${totalWater.toLocaleString('id-ID')} Liter`, change: 'Rentang terpilih', up: true, sub: 'Dari riwayat penyiraman' },
    { id: 'duration', icon: '⏱', label: 'Durasi Penyiraman', value: `${totalDuration.toLocaleString('id-ID')} menit`, change: 'Rentang terpilih', up: true, sub: 'Dari riwayat penyiraman' },
  ];

  // The top tabs are the quick filter; the select filter remains compatible with them.
  const activeTopFilter = activeZoneSel !== 'all'
    ? activeZoneSel
    : activeTab !== 'all' ? activeTab : appliedFilters.zone;
  const visibleZones = zones.filter(zone => {
    const status = zone.status || zone.state;
    if (activeTopFilter === 'all') return true;
    if (['kering', 'normal', 'basah'].includes(activeTopFilter)) {
      return String(status).toLowerCase() === activeTopFilter;
    }
    return String(zone.id) === String(activeTopFilter);
  });
  const chartActiveZones = visibleZones.length === zones.length
    ? 'all'
    : visibleZones.map(zone => String(zone.id));

  // Main chart title based on dataType
  const chartTitle = {
    moisture:    'Grafik Kelembapan Tanah (Semua Zona)',
    temperature: 'Grafik Suhu Tanah',
    watering:    'Grafik Penyiraman',
  }[appliedFilters.dataType];

  const dateRangeLabel = dateRange.start.getTime() === dateRange.end.getTime()
    ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(dateRange.start)
    : `${new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(dateRange.start)} – ${new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(dateRange.end)}`;
  const chartSubtitle = `Periode ${dateRangeLabel}`;
  const wateringSubtitle = `Jumlah penyiraman dan durasi · ${dateRangeLabel}`;
  const temperatureSubtitle = `Tren suhu tanah · ${dateRangeLabel}`;

  return (
    <section className="content">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="graph-page-header">
        <div>
          <div className="eyebrow">MONITORING IRIGASI</div>
          <h1>Grafik Kelembapan</h1>
          <p>Pantau tren kelembapan tanah, penyiraman, dan kondisi setiap zona secara real-time.</p>
        </div>
        <div className="graph-header-right">
          {/* Date range */}
          <DateRangePicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onApply={(start, end) => {
              setDateRange({ start, end });
            }}
          />
          {/* Export */}
          <button
            id="btn-export-data"
            className="primary-btn"
            style={{ width: 'auto', padding: '9px 16px', fontSize: 11, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => {
              const headers = ['Tanggal', 'Waktu', 'Zona', 'Tanaman', 'Kelembapan Sebelum', 'Kelembapan Sesudah', 'Durasi (menit)', 'Volume (Liter)', 'Metode', 'Status'];
              const rows = rangeHistory.map(row => [row.date, row.time, row.zoneName, row.plant, row.moistureBefore, row.moistureAfter, row.duration, row.waterVolume, row.method, row.status]);
              const csv = [headers, ...rows].map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
              const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
              const link = document.createElement('a');
              link.href = url;
              link.download = `grafik_irigasi_${startKey}_${endKey}.csv`;
              link.click();
              window.setTimeout(() => URL.revokeObjectURL(url), 1000);
              setExportNote(rangeHistory.length ? 'Data berhasil diekspor ke file CSV. Periksa folder unduhan Anda.' : 'Tidak ada data penyiraman pada rentang tanggal ini. File CSV hanya berisi judul kolom.');
              setTimeout(() => setExportNote(false), 3500);
            }}
          >
            <Download size={14} strokeWidth={1.8} /> Export Data
          </button>
        </div>
      </div>

      {exportNote && (
        <div className="export-note" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Check size={14} strokeWidth={2} /> {exportNote}
        </div>
      )}

      {(graphicsError || dummyGraphicsError || historyError) && (
        <div className="graphics-empty" role="alert">Data dashboard gagal dimuat dari API: {graphicsError || dummyGraphicsError || historyError}</div>
      )}

      {/* ── Zone filter tabs ────────────────────────────────────────────────── */}
      <div className="graph-zone-tabs-wrap">
        <div className="graph-zone-tabs">
          {zoneTabs.map(tab => (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              className={activeTab === tab.key ? 'filter-chip active' : 'filter-chip'}
              onClick={() => selectStatusFilter(tab.key)}
            >
              {tab.label}
              <span className="filter-chip-count">{tab.count}</span>
            </button>
          ))}
          <div className="zone-tab-divider" />
          {zoneSelectOptions.slice(1).map(opt => (
            <button
              key={opt.value}
              id={`tab-zone-${opt.value}`}
              className={activeZoneSel === opt.value ? 'zone-tab-pill active' : 'zone-tab-pill'}
              onClick={() => selectZoneFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI cards ───────────────────────────────────────────────────────── */}
      <KpiCards data={kpiData} />

      {/* ── Main content grid ───────────────────────────────────────────────── */}
      <div className="graph-main-grid">

        {/* Left / center column */}
        <div className="graph-left-col">

          {/* Main chart card */}
          <div className="graph-card">
            <div className="graph-card-header">
              <div>
                <h2 className="graph-card-title">{chartTitle}</h2>
                <p className="graph-card-sub">{chartSubtitle}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="period-badge">{dateRangeLabel}</span>
                {appliedFilters.dataType === 'moisture' && (
                  <span className="period-badge" style={{ background: '#e9f7ef', color: '#11855f' }}>
                    Kelembapan Tanah
                  </span>
                )}
              </div>
            </div>

            {/* Chart area */}
            {appliedFilters.dataType === 'moisture' && moistureDates.length > 0 && (
              <>
                <MoistureLineChart activeZones={chartActiveZones} data={moistureChartZones} labels={chartMoistureLabels} />
                <MoistureLegend activeZones={chartActiveZones} data={moistureChartZones} />
              </>
            )}
            {appliedFilters.dataType === 'moisture' && moistureDates.length === 0 && <div className="graphics-empty" role="status">Tidak ada data kelembapan bertimestamp pada rentang ini.{legacyMoistureCount ? ` ${legacyMoistureCount} data lama tersedia tanpa tanggal dan tidak dimasukkan ke filter.` : ''}</div>}
            {appliedFilters.dataType === 'temperature' && <TemperatureChart data={temperaturePoints} />}
            {appliedFilters.dataType === 'watering' && <WateringCombinedChart data={dailyWatering} hasRecords={wateringHasRecords} />}
          </div>

          <div className="graph-small-grid">
            <div className="graph-card">
              <div className="graph-card-header">
                <div>
                  <h2 className="graph-card-title">Grafik Penyiraman</h2>
                  <p className="graph-card-sub">{wateringSubtitle}</p>
                </div>
                <span className="period-badge">{dateRangeLabel}</span>
              </div>
              <WateringCombinedChart data={dailyWatering} hasRecords={wateringHasRecords} />
            </div>

            <div className="graph-card">
              <div className="graph-card-header">
                <div>
                  <h2 className="graph-card-title">Grafik Suhu Tanah</h2>
                  <p className="graph-card-sub">{temperatureSubtitle}</p>
                </div>
                <span className="period-badge">{dateRangeLabel}</span>
              </div>
              <TemperatureChart data={temperaturePoints} />
            </div>
          </div>

        </div>

        {/* Right sidebar */}
        <div className="graph-right-col">

          {/* Filter grafik */}
          <GraphicsFilter
            filters={filters}
            onChange={handleFilterChange}
            onApply={handleApplyFilter}
          />

          <div className="graph-card">
            <div className="graph-card-header" style={{ marginBottom: 12 }}>
              <div>
                <h2 className="graph-card-title">Statistik Zona</h2>
              </div>
              <span className="period-badge" style={{ whiteSpace: 'nowrap' }}>Kelembapan Rata-rata</span>
            </div>
            <ZoneStatistics data={visibleZones} onSelectZone={onSelectZone} />
          </div>

        </div>
      </div>

      {/* ── Riwayat tabel ───────────────────────────────────────────────────── */}
      {/* Riwayat ditampilkan penuh di bawah seluruh area grafik. */}
      <div className="graphics-history-main">
        <WateringHistoryTable
          data={rangeHistory.slice(0, 7).map(row => ({
            datetime: `${row.date} ${row.time}`,
            zone: row.zoneName,
            plant: row.plant,
            moistureBefore: `${row.moistureBefore ?? 0}%`,
            duration: `${row.duration ?? 0} menit`,
            volume: `${row.waterVolume ?? 0} Liter`,
            status: row.status,
          }))}
          onViewAll={() => onNavigate && onNavigate('Riwayat')}
        />
      </div>
    </section>
  );
}
