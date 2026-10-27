import React from 'react';
import { useApi, api } from '../services/api';
import { NotificationSummary } from '../components/notifications/NotificationSummary';
import { NotificationTabs } from '../components/notifications/NotificationTabs';
import { NotificationItem } from '../components/notifications/NotificationItem';
import { NotificationDetail } from '../components/notifications/NotificationDetail';
import { Check, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

const PER_PAGE_OPTIONS = [8, 16];

/** Mini Pagination — standalone agar tidak tergantung historyData */
function NotifPagination({ currentPage, totalItems, perPage, onPageChange, onPerPageChange }) {
  const totalPages = Math.ceil(totalItems / perPage);
  const from = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to   = Math.min(currentPage * perPage, totalItems);

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1);

  return (
    <div className="pagination-bar">
      <span className="pagination-info">
        Menampilkan {from}–{to} dari {totalItems} notifikasi
      </span>
      <div className="pagination-pages">
        <button
          className="page-btn" disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)} aria-label="Prev"
        ><ChevronLeft size={14} strokeWidth={2} /></button>
        {pages.map(p => (
          <button key={p}
            className={currentPage === p ? 'page-btn active' : 'page-btn'}
            onClick={() => onPageChange(p)}
          >{p}</button>
        ))}
        {totalPages > 7 && <span className="page-ellipsis">…</span>}
        {totalPages > 7 && (
          <button
            className={currentPage === totalPages ? 'page-btn active' : 'page-btn'}
            onClick={() => onPageChange(totalPages)}
          >{totalPages}</button>
        )}
        <button
          className="page-btn" disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)} aria-label="Next"
        ><ChevronRight size={14} strokeWidth={2} /></button>
      </div>
      <div className="per-page-wrap">
        <select
          id="notif-per-page"
          className="per-page-select"
          value={perPage}
          onChange={e => onPerPageChange(Number(e.target.value))}
        >
          {PER_PAGE_OPTIONS.map(n => (
            <option key={n} value={n}>{n} per halaman</option>
          ))}
        </select>
      </div>
    </div>
  );
}

/**
 * Halaman Notifikasi — dua kolom: list kiri + detail panel kanan.
 */
export function NotificationPage({ onNavigate, unreadCount, onMarkAllRead }) {
  const { data: items = [], setData: setItems, loading, error } = useApi('/notifications', []);
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
    let list = [...items];

    if (activeTab !== 'all') list = list.filter(n => n.category === activeTab);
    if (statusFilter === 'unread') list = list.filter(n => !n.read);
    if (statusFilter === 'read')   list = list.filter(n => n.read);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        (n.zoneName && n.zoneName.toLowerCase().includes(q)) ||
        (n.plant && n.plant.toLowerCase().includes(q))
      );
    }
    if (sortBy === 'newest') list.sort((a, b) => b.id - a.id);
    if (sortBy === 'oldest') list.sort((a, b) => a.id - b.id);
    if (sortBy === 'unread') list.sort((a, b) => (a.read ? 1 : 0) - (b.read ? 1 : 0));

    return list;
  }, [items, activeTab, statusFilter, search, sortBy]);

  const totalItems = filtered.length;
  const pageData   = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleSelect(item) {
    // Mark as read
    api.put(`/notification/${item.id}`, { read: true }).then(updated => setItems(prev => prev.map(n => n.id === item.id ? updated : n)));
    const updated = { ...item, read: true };
    setSelected(updated);
    setMobileDetail(true);
  }

  function handleMarkAllRead() {
    Promise.all(items.filter(n => !n.read).map(n => api.put(`/notification/${n.id}`, { read: true }))).then(() => setItems(prev => prev.map(n => ({ ...n, read: true }))));
    if (selected) setSelected(s => s ? { ...s, read: true } : null);
    onMarkAllRead && onMarkAllRead();
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelected(null);
  }

  // Sync selected item if items change
  React.useEffect(() => {
    if (selected) {
      const fresh = items.find(n => n.id === selected.id);
      if (fresh) setSelected(fresh);
    }
  }, [items]);

  const localUnread = items.filter(n => !n.read).length;

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
        <button
          id="btn-mark-all-read"
          className="secondary-btn"
          style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, padding: '8px 16px', whiteSpace: 'nowrap', flexShrink: 0 }}
          onClick={handleMarkAllRead}
          disabled={localUnread === 0}
        >
          <Check size={14} strokeWidth={2} /> Tandai Semua Dibaca
          {localUnread > 0 && (
            <span style={{ background: '#e44b4b', color: '#fff', fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 999 }}>
              {localUnread}
            </span>
          )}
        </button>
      </div>

      {/* ── Summary ────────────────────────────────────────────────────────── */}
      <NotificationSummary items={items} />

      {/* ── Tabs + filters ─────────────────────────────────────────────────── */}
      <NotificationTabs
        items={items}
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
              <NotifPagination
                currentPage={currentPage}
                totalItems={totalItems}
                perPage={perPage}
                onPageChange={p => setCurrentPage(p)}
                onPerPageChange={n => { setPerPage(n); setCurrentPage(1); }}
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
