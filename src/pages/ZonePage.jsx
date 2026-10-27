import React from 'react';
import { useApi, api } from '../services/api';
import { ZoneCard } from '../components/ZoneCard';
import { ZoneStatusBadge } from '../components/ZoneStatusBadge';
import { Search, LayoutGrid, List, Plus, SearchX, X } from 'lucide-react';

const FILTER_OPTIONS = [
  { label: 'Semua Zona', key: 'all' },
  { label: 'Zona Kering', key: 'Kering' },
  { label: 'Zona Normal', key: 'Normal' },
  { label: 'Zona Basah',  key: 'Basah' },
];

/**
 * Halaman daftar semua zona lahan.
 * Fitur: search, filter status, toggle grid/table, klik card → detail.
 */
export function ZonePage({ onSelectZone }) {
  const { data: zones = [], setData: setZones, loading, error } = useApi('/zones', []);
  const [search,       setSearch]       = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [viewMode,     setViewMode]     = React.useState('grid');
  const [addOpen, setAddOpen] = React.useState(false);
  const [newZone, setNewZone] = React.useState({ name: '', plant: '', area: '30 m²' });
  const [saving, setSaving] = React.useState(false);

  const filtered = React.useMemo(() => {
    return zones.filter(z => {
      const matchFilter = activeFilter === 'all' || z.status === activeFilter;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        z.name.toLowerCase().includes(q) ||
        z.plant.toLowerCase().includes(q) ||
        z.status.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [zones, search, activeFilter]);

  const counts = React.useMemo(() => ({
    all:    zones.length,
    Kering: zones.filter(z => z.status === 'Kering').length,
    Normal: zones.filter(z => z.status === 'Normal').length,
    Basah:  zones.filter(z => z.status === 'Basah').length,
  }), [zones]);

  async function handleAddZone(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const created = await api.post('/zones', newZone);
      setZones(prev => [...prev, created].sort((a, b) => a.id - b.id));
      setAddOpen(false);
      setNewZone({ name: '', plant: '', area: '30 m²' });
    } catch (err) {
      window.alert(err.message || 'Zona gagal ditambahkan.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="content">
      {/* Page heading */}
      <div className="page-heading" style={{ marginBottom: 20 }}>
        <div>
          <div className="eyebrow">Manajemen Lahan</div>
          <h1>Zona Lahan</h1>
          <p>Kelola dan pantau kondisi kelembapan tanah di setiap zona secara real-time.</p>
        </div>
      </div>

      {loading && <div className="empty-state">Memuat data zona dari database...</div>}
      {error && <div className="empty-state">Database belum terhubung: {error}</div>}

      {/* Toolbar */}
      <div className="zone-toolbar">
        <div className="search-wrap" style={{ flex: '1 1 260px', maxWidth: 380 }}>
          <Search size={15} strokeWidth={1.8} />
          <input
            id="zona-search"
            placeholder="Cari zona atau tanaman..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="zone-toolbar-right">
          <button id="btn-tambah-zona" className="primary-btn" style={{ width: 'auto', padding: '0 16px' }} onClick={() => setAddOpen(true)}>
            <Plus size={15} strokeWidth={2.2} />
            Tambah Zona
          </button>
          <div className="view-toggle">
            <button
              id="btn-view-grid"
              className={viewMode === 'grid' ? 'view-btn active' : 'view-btn'}
              onClick={() => setViewMode('grid')}
              aria-label="Tampilan grid"
              title="Grid"
            >
              <LayoutGrid size={16} strokeWidth={1.8} />
            </button>
            <button
              id="btn-view-table"
              className={viewMode === 'table' ? 'view-btn active' : 'view-btn'}
              onClick={() => setViewMode('table')}
              aria-label="Tampilan tabel"
              title="Tabel"
            >
              <List size={16} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="filter-chips">
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.key}
            id={`filter-${opt.key}`}
            className={activeFilter === opt.key ? 'filter-chip active' : 'filter-chip'}
            onClick={() => setActiveFilter(opt.key)}
          >
            {opt.label}
            <span className="filter-chip-count">{counts[opt.key]}</span>
          </button>
        ))}
      </div>

      {/* Result count */}
      <div className="zone-result-meta">
        Menampilkan <strong>{filtered.length}</strong> dari {zones.length} zona
        {search && <> · hasil pencarian "<em>{search}</em>"</>}
      </div>

      {/* Grid view */}
      {viewMode === 'grid' && (
        <div className="zones-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <SearchX size={40} strokeWidth={1.5} />
              </div>
              <div className="empty-title">Tidak ada zona ditemukan</div>
              <div className="empty-sub">Coba ubah kata kunci atau filter pencarian.</div>
            </div>
          ) : (
            filtered.map(zone => (
              <ZoneCard key={zone.id} zone={zone} onClick={onSelectZone} />
            ))
          )}
        </div>
      )}

      {/* Table view */}
      {viewMode === 'table' && (
        <div className="zones-table-wrap">
          <table className="zones-table">
            <thead>
              <tr>
                <th>Zona</th>
                <th>Tanaman</th>
                <th>Kelembapan</th>
                <th>Status</th>
                <th>Sensor</th>
                <th>Perangkat</th>
                <th>Diperbarui</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(zone => (
                <tr key={zone.id} onClick={() => onSelectZone(zone.id)} className="zones-table-row">
                  <td><strong>{zone.name}</strong></td>
                  <td>{zone.plant}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 5, background: '#eef2ef', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${zone.moisture}%`,
                          background: zone.status === 'Kering' ? '#e55353' : zone.status === 'Basah' ? '#2878d6' : '#10a67a',
                          borderRadius: 999,
                        }} />
                      </div>
                      <strong style={{ fontSize: 12 }}>{zone.moisture}%</strong>
                    </div>
                  </td>
                  <td><ZoneStatusBadge status={zone.status} /></td>
                  <td>{zone.sensors.length} sensor</td>
                  <td>
                    <span style={{ fontSize: 10, color: zone.deviceStatus === 'Online' ? '#11855f' : '#d63f3f', fontWeight: 700 }}>
                      {zone.deviceStatus}
                    </span>
                  </td>
                  <td style={{ fontSize: 10, color: '#779185' }}>{zone.lastUpdated}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="text-button"
                      onClick={e => { e.stopPropagation(); onSelectZone(zone.id); }}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {addOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setAddOpen(false)}>
          <form className="modal-box" onSubmit={handleAddZone}>
            <div className="modal-header">
              <div>
                <h2 style={{ margin: 0, fontSize: 15 }}>Tambah Zona</h2>
                <p style={{ margin: '3px 0 0', fontSize: 11, color: '#779185' }}>Data akan disimpan ke database MySQL.</p>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setAddOpen(false)} aria-label="Tutup"><X size={16} /></button>
            </div>
            <div className="modal-body">
              <FormField label="Nama Zona">
                <input required value={newZone.name} onChange={e => setNewZone(prev => ({ ...prev, name: e.target.value }))} placeholder="Contoh: Zona 10" />
              </FormField>
              <FormField label="Jenis Tanaman">
                <input required value={newZone.plant} onChange={e => setNewZone(prev => ({ ...prev, plant: e.target.value }))} placeholder="Contoh: Kopi" />
              </FormField>
              <FormField label="Luas Area">
                <input value={newZone.area} onChange={e => setNewZone(prev => ({ ...prev, area: e.target.value }))} />
              </FormField>
            </div>
            <div className="modal-footer">
              <button type="button" className="secondary-btn" onClick={() => setAddOpen(false)}>Batal</button>
              <button type="submit" className="primary-btn" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Zona'}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

function FormField({ label, children }) {
  return <div className="form-field"><label className="form-label">{label}</label>{children}</div>;
}
