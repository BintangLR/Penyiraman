import React from 'react';
import { useApi, api } from '../services/api';
import { NotificationSummary } from '../components/notifications/NotificationSummary';
import { NotificationTabs } from '../components/notifications/NotificationTabs';
import { NotificationItem } from '../components/notifications/NotificationItem';
import { NotificationDetail } from '../components/notifications/NotificationDetail';
import { Search, X } from 'lucide-react';
import { Pagination } from '../components/history/Pagination';

const PER_PAGE_OPTIONS = [8, 16];

/**
 * Halaman Notifikasi — dua kolom: list kiri + detail panel kanan.
 */
export function NotificationPage({ onNavigate }) {
  const { data: items = [], setData: setItems, loading, error } = useApi('/notifications', []);
  const notificationItems = Array.isArray(items) ? items : [];
  const [selected, setSelected] = React.useState(null);

  // Filters
  const [activeTab,     setActiveTab]     = React.useState('all');
  const [sortBy,        setSortBy]        = React.useState('newest');
  const [statusFilter,  setStatusFilter]  = React.useState('all');
  const [search,        setSearch]        = React.useState('');

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage,     setPerPage]     = React.useState(8);

  // Mobile detail modal
  const [mobileDetail, setMobileDetail] = React.useState(false);

  // ── Filter + sort ───────────────────────────────────────────────────────────
  const filtered = React.useMemo(() => {
    let list = [...notificationItems];

    if (activeTab !== 'all') list = list.filter(n => n.category === activeTab);
    if (statusFilter === 'unread') list = list.filter(n => !n.read);
    if (statusFilter === 'read')   list = list.filter(n => n.read);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(n =>
        String(n.title || '').toLowerCase().includes(q) ||
        String(n.description || '').toLowerCase().includes(q) ||
        String(n.zoneName || '').toLowerCase().includes(q) ||
        String(n.plant || '').toLowerCase().includes(q)
      );
    }
    if (sortBy === 'newest') list.sort((a, b) => b.id - a.id);
    if (sortBy === 'oldest') list.sort((a, b) => a.id - b.id);
    if (sortBy === 'unread') list.sort((a, b) => (a.read ? 1 : 0) - (b.read ? 1 : 0));

    return list;
  }, [notificationItems, activeTab, statusFilter, search, sortBy]);

  const totalItems = filtered.length;
  const pageData   = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleSelect(item) {
    // Mark as read
    api.put(`/notification/${item.id}`, { read: true }).then(updated => setItems(prev => (Array.isArray(prev) ? prev : []).map(n => n.id === item.id ? updated : n)));
    const updated = { ...item, read: true };
    setSelected(updated);
    setMobileDetail(true);
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelected(null);
  }

  // Sync selected item if items change
  React.useEffect(() => {
    if (selected) {
      const fresh = notificationItems.find(n => n.id === selected.id);
      if (fresh) setSelected(fresh);
    }
  }, [notificationItems, selected]);

  return (
    <section className="content">
      {loading && <div className="empty-state">Memuat notifikasi dari database...</div>}
      {error && <div className="empty-state">Database belum terhubung: {error}</div>}
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="notif-page-header">
        <div>
          <div className="eyebrow">MONITORING SISTEM</div>
          <h1>Notifikasi</h1>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#779185' }}>
            Pantau semua informasi penting terkait kondisi lahan, penyiraman, dan sistem irigasi.
          </p>
        </div>
      </div>

      {/* ── Summary ────────────────────────────────────────────────────────── */}
      <NotificationSummary items={notificationItems} />

      {/* ── Tabs + filters ─────────────────────────────────────────────────── */}
      <NotificationTabs
        items={notificationItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        sortBy={sortBy}
        onSortChange={v => { setSortBy(v); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={v => { setStatusFilter(v); setCurrentPage(1); }}
      />

      {/* ── Two-column body ────────────────────────────────────────────────── */}
      <div className="notif-body-grid">

        {/* Left: list */}
        <div className="notif-list-col">
          <div className="graph-card" style={{ padding: 0 }}>
            {/* Search bar */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f5f2' }}>
              <div className="notif-search-wrap">
                <span style={{ color: '#779185' }}><Search size={14} strokeWidth={1.8} /></span>
                <input
                  id="notif-search"
                  className="notif-search-input"
                  type="text"
                  placeholder="Cari zona, tanaman, atau notifikasi..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                />
                {search && (
                  <button style={{ background:'none', border:'none', cursor:'pointer', color:'#95a8a0', padding:'0 4px', display:'flex', alignItems:'center' }}
                    onClick={() => setSearch('')} aria-label="Hapus pencarian"><X size={14} strokeWidth={2} /></button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="notif-list">
              {pageData.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#95a8a0', fontSize: 12 }}>
                  Tidak ada notifikasi yang sesuai.
                </div>
              ) : pageData.map(item => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  isSelected={selected?.id === item.id}
                  onClick={handleSelect}
                />
              ))}
            </div>

            {/* Pagination */}
            <div style={{ borderTop: '1px solid #f0f5f2', padding: '12px 16px' }}>
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                perPage={perPage}
                onPageChange={p => setCurrentPage(p)}
                onPerPageChange={n => { setPerPage(n); setCurrentPage(1); }}
                perPageOptions={PER_PAGE_OPTIONS}
                pageSizeId="notif-per-page"
                itemLabel="notifikasi"
              />
            </div>
          </div>
        </div>

        {/* Right: detail panel (desktop) */}
        <div className="notif-detail-col">
          <div className="graph-card" style={{ padding: 0, position: 'sticky', top: 16 }}>
            <NotificationDetail
              item={selected}
              onClose={() => setSelected(null)}
              onNavigate={page => { onNavigate && onNavigate(page); }}
            />
          </div>
        </div>
      </div>

      {/* ── Mobile detail modal ────────────────────────────────────────────── */}
      {mobileDetail && selected && (
        <div className="notif-mobile-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setMobileDetail(false); }}>
          <div className="notif-mobile-modal">
            <NotificationDetail
              item={selected}
              onClose={() => setMobileDetail(false)}
              onNavigate={page => { setMobileDetail(false); onNavigate && onNavigate(page); }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
