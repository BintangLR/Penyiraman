import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// Pages
import { ZonePage }        from './pages/ZonePage';
import { ZoneDetailPage }  from './pages/ZoneDetailPage';
import { GraphicsPage }    from './pages/GraphicsPage';
import { HistoryPage }     from './pages/HistoryPage';
import { SchedulePage }    from './pages/SchedulePage';
import { SettingsPage }    from './pages/SettingsPage';
import { NotificationPage }from './pages/NotificationPage';
import { useApi, api } from './services/api';

// Auth
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm }           from './components/auth/LoginForm';
import { RegisterForm }        from './components/auth/RegisterForm';
import { LoadingScreen, SuccessScreen } from './components/auth/AuthScreens';
import { ProfileDropdown }     from './components/auth/ProfileDropdown';
import { LogoutConfirmModal }  from './components/auth/LogoutConfirmModal';

// Lucide icons
import {
  Sprout, LayoutDashboard, Map, BarChart3, History,
  CalendarDays, Bell, Settings, LogOut, Search,
  Droplets, Thermometer, Wifi, Cpu, ChevronRight,
  AlertTriangle, CheckCircle, Waves, Menu, X,
  Play, Square, Sun, Home,
} from 'lucide-react';

// ── Nav items ──────────────────────────────────────────────────────
const navItems = [
  { label: 'Dashboard',  icon: LayoutDashboard },
  { label: 'Zona',       icon: Map },
  { label: 'Grafik',     icon: BarChart3 },
  { label: 'Riwayat',   icon: History },
  { label: 'Jadwal',     icon: CalendarDays },
  { label: 'Notifikasi', icon: Bell },
  { label: 'Pengaturan', icon: Settings },
];

const bottomNavItems = [
  { label: 'Dashboard', shortLabel: 'Beranda', icon: Home },
  { label: 'Zona',      shortLabel: 'Zona',    icon: Map },
  { label: 'Grafik',    shortLabel: 'Grafik',  icon: BarChart3 },
  { label: 'Riwayat',  shortLabel: 'Riwayat', icon: History },
  { label: 'Jadwal',   shortLabel: 'Jadwal',   icon: CalendarDays },
];

// ── App root ───────────────────────────────────────────────────────
function App() {
  const { isAuthenticated, authView, enterApp, logout } = useAuth();
  const { data: dashboard = { zones: [] }, loading: dashboardLoading } = useApi('/dashboard', { zones: [] });
  const { data: notifications = [] } = useApi('/notifications', []);
  const zones = dashboard.zones || [];

  const [activeNav,   setActiveNav]   = React.useState('Dashboard');
  const [selectedZone, setSelectedZone] = React.useState('Zona 1 – Kopi');
  const [irrigating,  setIrrigating]  = React.useState(false);
  const [irrigationRunId, setIrrigationRunId] = React.useState(null);
  const [irrigationSaving, setIrrigationSaving] = React.useState(false);
  const [mobileMenu,  setMobileMenu]  = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [zoneRoute, setZoneRoute] = React.useState(null);
  React.useEffect(() => setUnreadCount(notifications.filter(n => !n.read).length), [notifications]);

  function navigateTo(page) {
    setActiveNav(page);
    setMobileMenu(false);
    if (page !== 'Zona') setZoneRoute(null);
  }

  function openZoneDetail(id) {
    setZoneRoute(id);
    setActiveNav('Zona');
  }

  function backToZoneList() { setZoneRoute(null); }

  async function handleIrrigationToggle() {
    const zoneId = Number(String(selectedZone).match(/\d+/)?.[0] || 1);
    setIrrigationSaving(true);
    try {
      if (!irrigating) {
        const result = await api.post('/irrigation/start', { zoneId });
        setIrrigationRunId(result.id);
        setIrrigating(true);
      } else if (irrigationRunId) {
        await api.put(`/irrigation/${irrigationRunId}/stop`, {});
        setIrrigationRunId(null);
        setIrrigating(false);
      } else {
        setIrrigating(false);
      }
    } catch (error) {
      window.alert(error.message || 'Kontrol penyiraman gagal disimpan ke database.');
    } finally {
      setIrrigationSaving(false);
    }
  }

  // ── Auth gate ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    if (authView === 'loading') return <LoadingScreen />;
    if (authView === 'success') return <SuccessScreen onEnter={enterApp} />;
    if (authView === 'register') return <RegisterForm />;
    return <LoginForm />;
  }

  return (
    <div className="app-shell">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
        {/* Brand */}
        <div className="brand">
          <div className="brand-mark">
            <Sprout size={20} strokeWidth={2} />
          </div>
          <div>
            <div className="brand-title">Irigasi Cerdas</div>
            <div className="brand-subtitle">Lahan Toraja</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={activeNav === label ? 'nav-item active' : 'nav-item'}
              onClick={() => navigateTo(label)}
              aria-current={activeNav === label ? 'page' : undefined}
            >
              <span className="nav-icon">
                <Icon size={18} strokeWidth={1.8} />
              </span>
              <span style={{ flex: 1 }}>{label}</span>
              {label === 'Notifikasi' && unreadCount > 0 && (
                <span className="nav-badge">{unreadCount}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="system-status">
            <span className="online-dot" />
            <div className="system-status-text">
              <strong>Sistem Online</strong>
              <small>
                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WITA
              </small>
            </div>
          </div>
          <button
            id="btn-sidebar-logout"
            type="button"
            className="sidebar-logout-btn"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Keluar dari akun"
          >
            <LogOut size={16} strokeWidth={1.8} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenu && (
        <button
          className="overlay"
          aria-label="Tutup menu"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(true)}
            aria-label="Buka menu"
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>

          <div className="search-wrap">
            <Search size={15} strokeWidth={1.8} />
            <input placeholder="Cari zona, tanaman, atau notifikasi..." />
          </div>

          <div className="topbar-right">
            <button
              className="icon-button"
              aria-label="Notifikasi"
              onClick={() => navigateTo('Notifikasi')}
              style={{ position: 'relative' }}
            >
              <Bell size={18} strokeWidth={1.8} />
              {unreadCount > 0 && <span className="notification-dot" />}
            </button>

            <ProfileDropdown
              onLogoutRequest={() => setShowLogoutModal(true)}
              onGoSettings={() => navigateTo('Pengaturan')}
            />
          </div>
        </header>

        {/* Logout modal */}
        {showLogoutModal && (
          <LogoutConfirmModal
            onConfirm={() => { setShowLogoutModal(false); logout(); }}
            onCancel={() => setShowLogoutModal(false)}
          />
        )}

        {/* ── Page router ─────────────────────────────────────────────── */}
        {activeNav === 'Dashboard' && (
          <DashboardPage
            zones={zones}
            loading={dashboardLoading}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            irrigating={irrigating}
            onIrrigationToggle={handleIrrigationToggle}
            irrigationSaving={irrigationSaving}
            onGoToZona={() => navigateTo('Zona')}
          />
        )}

        {activeNav === 'Zona' && zoneRoute === null && (
          <ZonePage onSelectZone={openZoneDetail} />
        )}

        {activeNav === 'Zona' && zoneRoute !== null && (
          <ZoneDetailPage zoneId={zoneRoute} onBack={backToZoneList} onNavigate={navigateTo} />
        )}

        {activeNav === 'Grafik' && (
          <GraphicsPage
            onSelectZone={(id) => { setZoneRoute(id); setActiveNav('Zona'); }}
            onNavigate={navigateTo}
          />
        )}
        {activeNav === 'Riwayat'   && <HistoryPage />}
        {activeNav === 'Jadwal'    && <SchedulePage onNavigate={navigateTo} />}
        {activeNav === 'Notifikasi' && (
          <NotificationPage
            onNavigate={navigateTo}
            unreadCount={unreadCount}
            onMarkAllRead={() => setUnreadCount(0)}
          />
        )}
        {activeNav === 'Pengaturan' && <SettingsPage onNavigate={navigateTo} />}

        {/* Bottom navigation (mobile) */}
        <nav className="bottom-nav" aria-label="Navigasi utama">
          {bottomNavItems.map(({ label, shortLabel, icon: Icon }) => (
            <button
              key={label}
              className={activeNav === label ? 'bottom-item active' : 'bottom-item'}
              onClick={() => navigateTo(label)}
              aria-label={label}
              aria-current={activeNav === label ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={activeNav === label ? 2 : 1.8} />
              <small>{shortLabel}</small>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}

// ── Dashboard Page ─────────────────────────────────────────────────
function DashboardPage({ zones, loading, selectedZone, setSelectedZone, irrigating, onIrrigationToggle, irrigationSaving, onGoToZona }) {
  if (loading) return <section className="content"><div className="empty-state">Memuat dashboard dari database...</div></section>;
  return (
    <section className="content">
      {/* Page heading */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">Monitoring Irigasi</div>
          <h1>Dashboard</h1>
          <p>Pantau kondisi lahan dan kendalikan penyiraman dari jarak jauh.</p>
        </div>
        <div className="weather-card">
          <Sun size={24} color="#f59e0b" strokeWidth={1.8} />
          <div>
            <span>Cerah, Toraja</span>
            <strong>30°C</strong>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-grid">
        <StatCard
          icon={<Map size={20} strokeWidth={1.8} />}
          label="Total Zona"
          value={zones.length}
          meta="Zona aktif"
        />
        <StatCard
          icon={<Cpu size={20} strokeWidth={1.8} />}
          label="Total Sensor"
          value={zones.reduce((total, zone) => total + (zone.sensors?.length || 0), 0)}
          meta="Sensor terhubung"
        />
        <StatCard
          icon={<AlertTriangle size={20} strokeWidth={1.8} />}
          label="Zona Kering"
          value={zones.filter(z => (z.status || z.state) === 'Kering').length}
          meta="Perlu perhatian"
          tone="danger"
        />
        <StatCard
          icon={<CheckCircle size={20} strokeWidth={1.8} />}
          label="Zona Normal"
          value={zones.filter(z => (z.status || z.state) === 'Normal').length}
          meta="Kondisi stabil"
          tone="success"
        />
        <StatCard
          icon={<Waves size={20} strokeWidth={1.8} />}
          label="Zona Basah"
          value={zones.filter(z => (z.status || z.state) === 'Basah').length}
          meta="Terpantau"
          tone="blue"
        />
      </div>

      {/* Dashboard grid */}
      <div className="dashboard-grid">
        {/* Field map */}
        <section className="card map-card">
          <CardHeader
            title="Peta Zona Lahan"
            subtitle="Status kelembapan setiap zona"
            action="Lihat semua"
            onAction={onGoToZona}
          />
          <div className="field-map">
            <div className="field-sky" />
            {zones.map((zone, i) => (
              <div
                key={zone.id}
                className={`field-cell ${(zone.state || zone.status || '').toLowerCase()}`}
                style={{ '--i': i }}
                title={`Zona ${zone.id} – ${zone.name || zone.plant}: ${zone.moisture}% (${zone.state || zone.status})`}
              >
                <span>Z{zone.id}</span>
                <small>{zone.name || zone.plant}</small>
              </div>
            ))}
          </div>
          <div className="legend">
            <span><i className="legend-dot danger" />Kering</span>
            <span><i className="legend-dot success" />Normal</span>
            <span><i className="legend-dot blue" />Basah</span>
          </div>
        </section>

        {/* Chart */}
        <section className="card chart-card">
          <CardHeader
            title="Grafik Kelembapan"
            subtitle="Semua zona · 7 hari terakhir"
            action="Detail grafik"
          />
          <MoistureChartDashboard />
        </section>

        {/* Quick control */}
        <section className="card quick-card">
          <CardHeader title="Kontrol Cepat" subtitle="Penyiraman manual" />
          <label className="field-label">Pilih Zona</label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
          >
            {zones.map((z) => (
              <option key={z.id}>Zona {z.id} – {z.name || z.plant}</option>
            ))}
          </select>

          <div className="selected-zone-mini">
            <span>
              <Sprout size={16} color="#0F8A63" strokeWidth={1.8} />
            </span>
            <div>
              <strong>{selectedZone}</strong>
              <small>Siap dikontrol</small>
            </div>
            <span className="status-pill success">Online</span>
          </div>

          <button
            className={`primary-btn ${irrigating ? 'stop' : ''}`}
            onClick={onIrrigationToggle}
            disabled={irrigationSaving}
          >
            {irrigating
              ? <><Square size={15} strokeWidth={2} />Hentikan Penyiraman</>
              : <><Play size={15} strokeWidth={2} />Mulai Penyiraman</>
            }
          </button>

          <div className="control-note">
            <AlertTriangle size={13} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 1 }} />
            Penyiraman manual akan tercatat ke riwayat sistem.
          </div>
        </section>

        {/* Zone summary */}
        <section className="card zones-card">
          <CardHeader
            title="Ringkasan Kondisi Zona"
            subtitle="Kelembapan terbaru"
            action="Kelola zona"
            onAction={onGoToZona}
          />
          <div className="zone-list">
            {zones.map(zone => <ZoneRow key={zone.id} zone={zone} />)}
          </div>
        </section>

        {/* System status */}
        <section className="card status-card">
          <CardHeader title="Status Sistem" subtitle="Koneksi perangkat" />
          <div className="system-status-grid">
            <StatusItem icon={<Cpu size={16} strokeWidth={1.8} />}    title="ESP32"    value="Online" />
            <StatusItem icon={<Wifi size={16} strokeWidth={1.8} />}   title="MySQL" value="Terhubung" />
            <StatusItem icon={<Droplets size={16} strokeWidth={1.8} />} title="Sensor" value="27 / 27" />
            <StatusItem icon={<Settings size={16} strokeWidth={1.8} />} title="Valve"  value="Siaga" />
          </div>
          <div className="last-sync">Sinkronisasi terakhir · 08:57 WITA</div>
        </section>
      </div>

      {/* Mobile irrigation button */}
      <div className="mobile-only-irrigation">
        <button
          className={`primary-btn ${irrigating ? 'stop' : ''}`}
          onClick={onIrrigationToggle}
          disabled={irrigationSaving}
        >
          {irrigating
            ? <><Square size={15} strokeWidth={2} />Hentikan Penyiraman</>
            : <><Play size={15} strokeWidth={2} />Mulai Penyiraman</>
          }
        </button>
      </div>
    </section>
  );
}

// ── Reusable dashboard components ─────────────────────────────────

function StatCard({ icon, label, value, meta, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone || ''}`}>{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{meta}</small>
      </div>
    </div>
  );
}

function CardHeader({ title, subtitle, action, onAction }) {
  return (
    <div className="card-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && (
        <button className="text-button" onClick={onAction}>
          {action} <ChevronRight size={13} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

function ZoneRow({ zone }) {
  const state = zone.state || zone.status || 'Normal';
  return (
    <div className="zone-row">
      <div className="zone-number">Z{zone.id}</div>
      <div className="zone-name">
        <strong>{zone.name || zone.plant}</strong>
        <small>{zone.sensors?.length || 0} sensor</small>
      </div>
      <div className={`zone-state ${state.toLowerCase()}`}>
        <strong>{zone.moisture}%</strong>
        <small>{state}</small>
      </div>
    </div>
  );
}

function StatusItem({ icon, title, value }) {
  return (
    <div className="status-item">
      <span className="status-item-icon">{icon}</span>
      <div>
        <strong>{title}</strong>
        <small>{value}</small>
      </div>
      <span className="online-dot" style={{ marginLeft: 'auto' }} />
    </div>
  );
}

function MoistureChartDashboard() {
  const width = 760, height = 240, pad = { l: 40, r: 16, t: 16, b: 32 };
  const x = i => pad.l + (i * (width - pad.l - pad.r) / 6);
  const y = v => pad.t + ((80 - v) * (height - pad.t - pad.b) / 60);
  const points = series => series.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const days   = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const series = [
    [42, 39, 46, 52, 58, 54, 62],
    [48, 52, 49, 55, 61, 58, 65],
    [36, 41, 38, 45, 43, 51, 47],
    [54, 49, 56, 61, 65, 60, 68],
  ];

  return (
    <div className="chart-wrap">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="chart-svg"
        role="img"
        aria-label="Grafik kelembapan zona selama tujuh hari"
      >
        {[20, 40, 60, 80].map(v => (
          <g key={v}>
            <line x1={pad.l} x2={width - pad.r} y1={y(v)} y2={y(v)} className="grid-line" />
            <text x={4} y={y(v) + 4} className="axis-label">{v}%</text>
          </g>
        ))}
        {series.map((s, idx) => (
          <polyline
            key={idx}
            points={points(s)}
            className={`series-line s${idx}`}
            fill="none"
          />
        ))}
        {days.map((d, i) => (
          <text key={d} x={x(i)} y={height - 7} textAnchor="middle" className="axis-label">
            {d}
          </text>
        ))}
      </svg>
      <div className="chart-legend">
        {['Zona 1', 'Zona 2', 'Zona 3', 'Zona 4'].map((n, i) => (
          <span key={n}><i className={`chart-dot s${i}`} />{n}</span>
        ))}
        <span><i className="chart-dot s4" />Rata-rata</span>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
