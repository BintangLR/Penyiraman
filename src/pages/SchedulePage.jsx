import React from 'react';
import { useApi, api } from '../services/api';
import { ScheduleSummary } from '../components/schedule/ScheduleSummary';
import { ScheduleTabs } from '../components/schedule/ScheduleTabs';
import { ScheduleCard } from '../components/schedule/ScheduleCard';
import { ScheduleForm } from '../components/schedule/ScheduleForm';
import { ConfirmDialog } from '../components/schedule/ConfirmDialog';
import { WaterUsageCard } from '../components/schedule/WaterUsageCard';
import { ScheduleSummaryCard } from '../components/schedule/ScheduleSummaryCard';
import { ScheduledHistory } from '../components/schedule/ScheduledHistory';

let nextId = 10;

/**
 * Halaman Jadwal Penyiraman — manajemen jadwal irigasi otomatis.
 */
export function SchedulePage({ onNavigate }) {
  const { data: schedules = [], setData: setSchedules, loading, error } = useApi('/schedules', []);
  const { data: history = [] } = useApi('/history', []);
  const [activeTab,  setActiveTab]  = React.useState('all');
  const [sortBy,     setSortBy]     = React.useState('zone-asc');

  // Modal
  const [formOpen,   setFormOpen]   = React.useState(false);
  const [editTarget, setEditTarget] = React.useState(null);

  // Confirm delete
  const [deleteId,   setDeleteId]   = React.useState(null);

  // ── Filter + sort ─────────────────────────────────────────────────────────
  const displayed = React.useMemo(() => {
    let list = [...schedules];

    // Tab filter
    if (activeTab === 'active')   list = list.filter(s => s.active);
    if (activeTab === 'inactive') list = list.filter(s => !s.active);

    // Sort
    if (sortBy === 'zone-asc')   list.sort((a, b) => a.zoneId - b.zoneId);
    if (sortBy === 'zone-desc')  list.sort((a, b) => b.zoneId - a.zoneId);
    if (sortBy === 'time-asc')   list.sort((a, b) => a.time.localeCompare(b.time));
    if (sortBy === 'time-desc')  list.sort((a, b) => b.time.localeCompare(a.time));

    return list;
  }, [schedules, activeTab, sortBy]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleToggle(id) {
    const current = schedules.find(s => s.id === id);
    api.put(`/schedules/${id}`, { active: !current.active }).then(updated => setSchedules(prev => prev.map(s => s.id === id ? updated : s)));
  }

  function handleEdit(schedule) {
    setEditTarget(schedule);
    setFormOpen(true);
  }

  function handleAddNew() {
    setEditTarget(null);
    setFormOpen(true);
  }

  function handleSave(data) {
    if (editTarget) {
      api.put(`/schedules/${editTarget.id}`, data).then(updated => setSchedules(prev => prev.map(s => s.id === editTarget.id ? updated : s)));
    } else {
      api.post('/schedules', data).then(created => setSchedules(prev => [...prev, created]));
    }
    setFormOpen(false);
    setEditTarget(null);
  }

  function handleDelete(id) {
    api.delete(`/schedules/${id}`).then(() => setSchedules(prev => prev.filter(s => s.id !== id)));
    setDeleteId(null);
  }

  function handleDeleteRequest(id) {
    setDeleteId(id);
  }

  const deletingSchedule = schedules.find(s => s.id === deleteId);

  return (
    <section className="content">
      {loading && <div className="empty-state">Memuat jadwal dari database...</div>}
      {error && <div className="empty-state">Database belum terhubung: {error}</div>}
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="sched-page-header">
        <div>
          <div className="eyebrow">MANAJEMEN IRIGASI</div>
          <h1>Jadwal Penyiraman</h1>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#779185' }}>
            Atur jadwal penyiraman otomatis untuk setiap zona sesuai kebutuhan tanaman.
          </p>
        </div>
        <button
          id="btn-tambah-jadwal"
          className="primary-btn"
          style={{ width: 'auto', padding: '10px 18px', fontSize: 12, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 7 }}
          onClick={handleAddNew}
        >
          <span style={{ fontSize: 14 }}>+</span> Tambah Jadwal
        </button>
      </div>

      {/* ── Summary cards ───────────────────────────────────────────────── */}
      <ScheduleSummary schedules={schedules} />

      {/* ── Main layout: list + sidebar ──────────────────────────────────── */}
      <div className="sched-main-grid">

        {/* Left: list */}
        <div className="sched-left-col">
          {/* Tabs + sort */}
          <ScheduleTabs
            schedules={schedules}
            activeTab={activeTab}
            onTabChange={tab => setActiveTab(tab)}
            sortBy={sortBy}
            onSortChange={v => setSortBy(v)}
          />

          {/* Schedule list */}
          <div className="sched-list">
            {displayed.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#95a8a0', fontSize: 12 }}>
                Tidak ada jadwal yang sesuai filter.
              </div>
            ) : displayed.map(s => (
              <ScheduleCard
                key={s.id}
                schedule={s}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="sched-right-col">
          <WaterUsageCard history={history} />
          <ScheduleSummaryCard schedules={schedules} />
        </div>
      </div>

      {/* ── Riwayat terjadwal ───────────────────────────────────────────── */}
      <ScheduledHistory history={history} onViewAll={() => onNavigate && onNavigate('Riwayat')} />

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      <ScheduleForm
        open={formOpen}
        initial={editTarget}
        onSave={handleSave}
        onClose={() => { setFormOpen(false); setEditTarget(null); }}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus jadwal ini?"
        message={deletingSchedule
          ? `Jadwal penyiraman ${deletingSchedule.zoneName} – ${deletingSchedule.plant} pada pukul ${deletingSchedule.time} akan dihapus secara permanen.`
          : 'Jadwal yang dihapus tidak dapat dikembalikan.'}
        onConfirm={() => handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </section>
  );
}
