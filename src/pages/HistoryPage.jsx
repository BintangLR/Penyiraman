import React from 'react';
import { useApi } from '../services/api';
import { HistorySummary } from '../components/history/HistorySummary';
import { HistoryFilter } from '../components/history/HistoryFilter';
import { HistoryTable } from '../components/history/HistoryTable';
import { HistoryDetailModal } from '../components/history/HistoryDetailModal';
import { ZONES_CONFIG } from '../data/zonesData';

const DEFAULT_FILTERS = {
  startDate: new Date(2025, 8, 14),
  endDate: new Date(2025, 8, 20),
  zoneId: 'all',
  plant: 'all',
  status: 'all',
};

const PLANT_OPTIONS = ['Kopi', 'Cabai', 'Tomat', 'Sawi', 'Selada', 'Jagung', 'Kubis', 'Wortel', 'Kentang'];
const STATUS_OPTIONS = ['Selesai', 'Berjalan', 'Gagal', 'Dibatalkan'];

const MONTHS = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
  mei: 4, may: 4, jun: 5, june: 5, jul: 6, july: 6, agu: 7, agustus: 7, aug: 7, august: 7,
  sep: 8, sept: 8, september: 8, okt: 9, october: 9, oct: 9, nov: 10, november: 10, des: 11, dec: 11, december: 11,
};

function parseLocalDate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  const text = String(value).trim();
  const isoDate = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
  if (isoDate) {
    const date = new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]));
    return date.getFullYear() === Number(isoDate[1]) && date.getMonth() === Number(isoDate[2]) - 1 && date.getDate() === Number(isoDate[3])
      ? date
      : null;
  }
  const localized = text.match(/^(\d{1,2})\s+([A-Za-zÀ-ÿ.]+)\s+(\d{4})$/);
  if (!localized) return null;
  const month = MONTHS[localized[2].replace('.', '').toLowerCase()];
  if (month === undefined) return null;
  const date = new Date(Number(localized[3]), month, Number(localized[1]));
  return date.getMonth() === month && date.getDate() === Number(localized[1]) ? date : null;
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

/**
 * Halaman Riwayat Penyiraman
 * Menampilkan ringkasan, filter, tabel data, modal detail, dan pagination.
 */
export function HistoryPage() {
  const { data: history = [], loading, error } = useApi('/history', []);
  const { data: liveZones = [] } = useApi('/zones', []);
  // Filter state
  const [pendingFilters, setPendingFilters] = React.useState(() => ({ ...DEFAULT_FILTERS }));
  const [appliedFilters, setAppliedFilters] = React.useState(() => ({ ...DEFAULT_FILTERS }));

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  // Detail modal
  const [selectedRow, setSelectedRow] = React.useState(null);

  // Export feedback
  const [exportDone, setExportDone] = React.useState(false);

  // ── Filter logic ─────────────────────────────────────────────────────────
  const filtered = React.useMemo(() => {
    const startKey = dateKey(appliedFilters.startDate);
    const endKey = dateKey(appliedFilters.endDate);
    return history.filter(row => {
      const rowDate = parseLocalDate(row.date);
      if (!rowDate) return false;
      const key = dateKey(rowDate);
      if (key < startKey || key > endKey) return false;
      if (appliedFilters.zoneId !== 'all' && String(row.zoneId) !== appliedFilters.zoneId) return false;
      if (appliedFilters.plant !== 'all' && row.plant !== appliedFilters.plant) return false;
      if (appliedFilters.status !== 'all' && row.status !== appliedFilters.status) return false;
      return true;
    });
  }, [history, appliedFilters]);

  const totalItems = filtered.length;
  const zoneOptions = React.useMemo(() => {
    const zonesById = new Map();
    ZONES_CONFIG.forEach(zone => {
      zonesById.set(String(zone.id), {
        id: zone.id,
        label: `${zone.name || `Zona ${zone.id}`} – ${zone.plant || 'Tanaman belum diatur'}`,
      });
    });
    liveZones.forEach(zone => {
      zonesById.set(String(zone.id), {
        id: zone.id,
        label: `${zone.name || `Zona ${zone.id}`} – ${zone.plant || 'Tanaman belum diatur'}`,
      });
    });
    history.forEach(row => {
      const id = String(row.zoneId ?? '');
      if (id && !zonesById.has(id)) {
        zonesById.set(id, { id, label: `${row.zoneName || `Zona ${id}`} – ${row.plant || 'Tanaman belum diatur'}` });
      }
    });
    return [...zonesById.values()].sort((a, b) => Number(a.id) - Number(b.id));
  }, [history, liveZones]);
  const plantOptions = React.useMemo(
    () => [...new Set([...PLANT_OPTIONS, ...history.map(row => row.plant).filter(Boolean)])],
    [history],
  );
  const statusOptions = React.useMemo(
    () => [...new Set([...STATUS_OPTIONS, ...history.map(row => row.status).filter(Boolean)])],
    [history],
  );

  // Paginated slice
  const pageData = React.useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, currentPage, perPage]);

  function handleFilterChange(key, val) {
    setPendingFilters(prev => ({ ...prev, [key]: val }));
  }

  function handleApply() {
    setAppliedFilters({ ...pendingFilters });
    setCurrentPage(1);
  }

  function handleReset() {
    const resetFilters = { ...DEFAULT_FILTERS };
    setPendingFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
  }

  function handleExport() {
    // Build CSV content
    const headers = ['No', 'Tanggal', 'Waktu', 'Zona', 'Tanaman', 'Kelembapan Sebelum', 'Kelembapan Sesudah', 'Durasi (menit)', 'Volume (Liter)', 'Metode', 'Status'];
    const rows = filtered.map((r, i) => [
      i + 1, r.date, r.time, r.zoneName, r.plant,
      r.moistureBefore == null ? '' : `${r.moistureBefore}%`,
      r.moistureAfter == null ? '' : `${r.moistureAfter}%`,
      r.duration, r.waterVolume, r.method, r.status,
    ]);
    const csv = [headers, ...rows].map(row => row.map(csvCell).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riwayat_penyiraman_${dateKey(appliedFilters.startDate)}_${dateKey(appliedFilters.endDate)}.csv`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2500);
  }

  return (
    <section className="content">
      {error && <div className="empty-state" role="alert">Gagal memuat riwayat penyiraman: {error}</div>}
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div className="eyebrow">MONITORING IRIGASI</div>
        <h1>Riwayat Penyiraman</h1>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#779185' }}>
          Lihat seluruh riwayat penyiraman di semua zona.
        </p>
      </div>

      {/* ── Summary cards ─────────────────────────────────────────────── */}
      <HistorySummary history={history} />

      {/* ── Filter bar ────────────────────────────────────────────────── */}
      <div className="graph-card" style={{ marginBottom: 16, padding: '16px 20px' }}>
        <HistoryFilter
          filters={pendingFilters}
          onChange={handleFilterChange}
          onApply={handleApply}
          onReset={handleReset}
          zones={zoneOptions}
          plants={plantOptions}
          statuses={statusOptions}
        />
      </div>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <HistoryTable
        data={pageData}
        totalItems={totalItems}
        currentPage={currentPage}
        perPage={perPage}
        onPageChange={p => setCurrentPage(p)}
        onPerPageChange={n => { setPerPage(n); setCurrentPage(1); }}
        onDetail={row => setSelectedRow(row)}
        onExport={handleExport}
        exportDone={exportDone}
        loading={loading}
      />

      {/* ── Detail Modal ─────────────────────────────────────────────── */}
      {selectedRow && (
        <HistoryDetailModal row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}
    </section>
  );
}
