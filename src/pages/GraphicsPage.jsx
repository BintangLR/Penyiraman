import React from 'react';
import { KpiCards } from '../components/graphics/KpiCards';
import { MoistureLineChart, MoistureLegend } from '../components/graphics/MoistureLineChart';
import { WateringCombinedChart } from '../components/graphics/WateringCombinedChart';
import { TemperatureChart } from '../components/graphics/TemperatureChart';
import { ZoneDistributionChart } from '../components/graphics/ZoneDistributionChart';
import { ZoneStatistics } from '../components/graphics/ZoneStatistics';
import { WateringHistoryTable } from '../components/graphics/WateringHistoryTable';
import { GraphicsFilter } from '../components/graphics/GraphicsFilter';
import { ZONES_SUMMARY, PERIOD_OPTIONS, DATA_TYPE_OPTIONS } from '../data/graphData';
import { useApi } from '../services/api';
import { Calendar, ChevronDown, Download, Check } from 'lucide-react';

/**
 * Halaman Grafik Kelembapan — monitoring visual lengkap.
 */
export function GraphicsPage({ onSelectZone, onNavigate }) {
  const { data: graphics = {} } = useApi('/graphics', {});
  const { data: history = [] } = useApi('/history', []);
  const { data: liveZones = [] } = useApi('/zones', []);
  const zones = liveZones.length ? liveZones : (graphics.ZONES_SUMMARY || ZONES_SUMMARY);
  const zoneSelectOptions = [
    { value: 'all', label: 'Semua Zona' },
    ...zones.map(z => ({ value: String(z.id), label: `${z.name} – ${z.plant}` })),
  ];
  const totalWater = history.reduce((sum, row) => sum + Number(row.waterVolume || 0), 0);
  const totalDuration = history.reduce((sum, row) => sum + Number(row.duration || 0), 0);
  const averageMoisture = zones.length
    ? Math.round(zones.reduce((sum, zone) => sum + Number(zone.moisture || 0), 0) / zones.length)
    : 0;
  const kpiData = history.length ? [
    { id: 'humidity', icon: '💧', label: 'Rata-rata Kelembapan', value: `${averageMoisture}%`, change: 'Aktual', up: true, sub: 'Dari zona database' },
    { id: 'watering', icon: '🚿', label: 'Total Penyiraman', value: `${history.length} kali`, change: 'Aktual', up: true, sub: 'Dari riwayat database' },
    { id: 'water', icon: '🪣', label: 'Total Air Digunakan', value: `${totalWater.toLocaleString('id-ID')} Liter`, change: 'Aktual', up: true, sub: 'Dari riwayat database' },
    { id: 'duration', icon: '⏱', label: 'Durasi Penyiraman', value: `${totalDuration.toLocaleString('id-ID')} menit`, change: 'Aktual', up: true, sub: 'Dari riwayat database' },
  ] : (graphics.KPI_DATA || []);
  const distributionData = zones.length ? ['Kering', 'Normal', 'Basah'].map((status, index) => {
    const count = zones.filter(zone => (zone.status || zone.state) === status).length;
    return { label: `Zona ${status}`, count, pct: Math.round((count / zones.length) * 100), color: ['#e55353', '#10a67a', '#2878d6'][index] };
  }) : (graphics.DISTRIBUTION_DATA || []);
  const zoneTabs = [
    { key: 'all', label: 'Semua Zona', count: zones.length },
    { key: 'kering', label: 'Zona Kering', count: zones.filter(z => (z.status || z.state) === 'Kering').length },
    { key: 'normal', label: 'Zona Normal', count: zones.filter(z => (z.status || z.state) === 'Normal').length },
    { key: 'basah', label: 'Zona Basah', count: zones.filter(z => (z.status || z.state) === 'Basah').length },
  ];
  const wateringHistory = history.slice(0, 7).map(row => ({
    datetime: `${row.date} ${row.time}`,
    zone: row.zoneName,
    plant: row.plant,
    moistureBefore: `${row.moistureBefore ?? 0}%`,
    duration: `${row.duration ?? 0} menit`,
    volume: `${row.waterVolume ?? 0} Liter`,
    status: row.status,
  }));
  // Filter state
  const [activeTab,    setActiveTab]    = React.useState('all');
  const [activeZoneSel, setActiveZoneSel] = React.useState('all');
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
  }

  // Date range display
  const dateRange = history.length
    ? `${history[history.length - 1].date} – ${history[0].date}`
    : 'Belum ada data';

  // Resolve chart active zone
  const chartActiveZone = appliedFilters.zone;

  // Main chart title based on dataType
  const chartTitle = {
    moisture:    'Grafik Kelembapan Tanah (Semua Zona)',
    temperature: 'Grafik Suhu Tanah',
    watering:    'Grafik Penyiraman',
  }[appliedFilters.dataType];

  const chartSubtitle = {
    moisture:    'Tren kelembapan rata-rata 7 hari terakhir',
    temperature: 'Tren suhu tanah rata-rata',
    watering:    'Jumlah penyiraman dan durasi per hari',
  }[appliedFilters.dataType];

  const periodLabel = PERIOD_OPTIONS.find(p => p.value === appliedFilters.period)?.label || '7 Hari Terakhir';

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
          <div className="date-range-btn">
            <span style={{ color: '#779185', display: 'flex', alignItems: 'center' }}><Calendar size={14} strokeWidth={1.8} /></span>
            <span>{dateRange}</span>
            <span style={{ color: '#95a8a0', display: 'flex', alignItems: 'center' }}><ChevronDown size={14} strokeWidth={2} /></span>
          </div>
          {/* Export */}
          <button
            id="btn-export-data"
            className="primary-btn"
            style={{ width: 'auto', padding: '9px 16px', fontSize: 11, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => {
              const headers = ['Tanggal', 'Waktu', 'Zona', 'Tanaman', 'Kelembapan Sebelum', 'Kelembapan Sesudah', 'Durasi (menit)', 'Volume (Liter)', 'Metode', 'Status'];
              const rows = history.map(row => [row.date, row.time, row.zoneName, row.plant, row.moistureBefore, row.moistureAfter, row.duration, row.waterVolume, row.method, row.status]);
              const csv = [headers, ...rows].map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
              const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
              const link = document.createElement('a');
              link.href = url;
              link.download = 'grafik_irigasi.csv';
              link.click();
              URL.revokeObjectURL(url);
              setExportNote(true); setTimeout(() => setExportNote(false), 2500);
            }}
          >
            <Download size={14} strokeWidth={1.8} /> Export Data
          </button>
        </div>
      </div>

      {exportNote && (
        <div className="export-note" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Check size={14} strokeWidth={2} /> Data berhasil diekspor ke file CSV. Periksa folder unduhan Anda.
        </div>
      )}

      {/* ── Zone filter tabs ────────────────────────────────────────────────── */}
      <div className="graph-zone-tabs-wrap">
        <div className="graph-zone-tabs">
          {zoneTabs.map(tab => (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              className={activeTab === tab.key ? 'filter-chip active' : 'filter-chip'}
              onClick={() => setActiveTab(tab.key)}
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
              onClick={() => setActiveZoneSel(opt.value)}
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
                <span className="period-badge">{periodLabel}</span>
                {appliedFilters.dataType === 'moisture' && (
                  <span className="period-badge" style={{ background: '#e9f7ef', color: '#11855f' }}>
                    Kelembapan Tanah
                  </span>
                )}
              </div>
            </div>

            {/* Chart area */}
            {appliedFilters.dataType === 'moisture' && (
              <>
                <MoistureLineChart activeZones={chartActiveZone} data={zones} />
                <MoistureLegend activeZones={chartActiveZone} data={zones} />
              </>
            )}
            {appliedFilters.dataType === 'temperature' && <TemperatureChart />}
            {appliedFilters.dataType === 'watering'    && <WateringCombinedChart />}
          </div>

          {/* Two small charts side by side */}
          <div className="graph-small-grid">
            {/* Penyiraman */}
            <div className="graph-card">
              <div className="graph-card-header">
                <div>
                  <h2 className="graph-card-title">Grafik Penyiraman</h2>
                  <p className="graph-card-sub">Jumlah penyiraman dan durasi per hari</p>
                </div>
                <span className="period-badge">7 Hari Terakhir</span>
              </div>
              <WateringCombinedChart />
            </div>

            {/* Suhu */}
            <div className="graph-card">
              <div className="graph-card-header">
                <div>
                  <h2 className="graph-card-title">Grafik Suhu Tanah</h2>
                  <p className="graph-card-sub">Tren suhu tanah rata-rata</p>
                </div>
                <span className="period-badge">7 Hari Terakhir</span>
              </div>
              <TemperatureChart />
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

          {/* Statistik zona */}
          <div className="graph-card">
            <div className="graph-card-header" style={{ marginBottom: 12 }}>
              <div>
                <h2 className="graph-card-title">Statistik Zona</h2>
              </div>
              <span className="period-badge" style={{ whiteSpace: 'nowrap' }}>Kelembapan Rata-rata</span>
            </div>
            <ZoneStatistics data={zones} onSelectZone={onSelectZone} />
          </div>

          {/* Distribusi kondisi zona */}
          <div className="graph-card">
            <h2 className="graph-card-title" style={{ marginBottom: 12 }}>Distribusi Kondisi Zona</h2>
            <ZoneDistributionChart data={distributionData} />
          </div>
        </div>
      </div>

      {/* ── Riwayat tabel ───────────────────────────────────────────────────── */}
      <div style={{ marginTop: 20 }}>
        <WateringHistoryTable data={wateringHistory} onViewAll={() => onNavigate && onNavigate('Riwayat')} />
      </div>

    </section>
  );
}
