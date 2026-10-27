import React from 'react';
import { useApi } from '../services/api';
import { HistorySummary } from '../components/history/HistorySummary';
import { HistoryFilter } from '../components/history/HistoryFilter';
import { HistoryTable } from '../components/history/HistoryTable';
import { HistoryDetailModal } from '../components/history/HistoryDetailModal';

const DEFAULT_FILTERS = {
  dateRange: '14 Sep 2025 – 20 Sep 2025',
  zone: 'Semua Zona',
  plant: 'Semua Tanaman',
  status: 'Semua Status',
};

/**
 * Halaman Riwayat Penyiraman
 * Menampilkan ringkasan, filter, tabel data, modal detail, dan pagination.
 */
export function HistoryPage() {
  const { data: history = [], loading, error } = useApi('/history', []);
  // Filter state
  const [pendingFilters, setPendingFilters] = React.useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = React.useState(DEFAULT_FILTERS);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  // Detail modal
  const [selectedRow, setSelectedRow] = React.useState(null);

  // Export feedback
  const [exportDone, setExportDone] = React.useState(false);

  // ── Filter logic ─────────────────────────────────────────────────────────
  const filtered = React.useMemo(() => {
    return history.filter(row => {
      if (appliedFilters.zone !== 'Semua Zona' && row.zoneName !== appliedFilters.zone) return false;
      if (appliedFilters.plant !== 'Semua Tanaman' && row.plant !== appliedFilters.plant) return false;
      if (appliedFilters.status !== 'Semua Status' && row.status !== appliedFilters.status) return false;
      return true;
    });
  }, [history, appliedFilters]);

  const totalItems = filtered.length;

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
    setPendingFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }

  function handleExport() {
    // Build CSV content
    const headers = ['No', 'Tanggal', 'Waktu', 'Zona', 'Tanaman', 'Kelembapan Sebelum', 'Kelembapan Sesudah', 'Durasi (menit)', 'Volume (Liter)', 'Metode', 'Status'];
    const rows = filtered.map((r, i) => [i + 1, r.date, r.time, r.zoneName, r.plant, r.moistureBefore + '%', r.moistureAfter + '%', r.duration, r.waterVolume, r.method, r.status]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'riwayat_penyiraman.csv'; a.click();
    URL.revokeObjectURL(url);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2500);
  }

  return (
    <section className="content">
      {loading && <div className="empty-state">Memuat riwayat dari database...</div>}
      {error && <div className="empty-state">Database belum terhubung: {error}</div>}
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
      />

      {/* ── Detail Modal ─────────────────────────────────────────────── */}
      {selectedRow && (
        <HistoryDetailModal row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}
    </section>
  );
}
