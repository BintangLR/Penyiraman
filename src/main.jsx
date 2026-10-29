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
import { WeatherWidget }      from './components/WeatherWidget';
import { DashboardMoistureChart } from './components/DashboardMoistureChart';
import { safeTheme, safeTimezone, TIMEZONES, DEFAULT_TIMEZONE } from './services/preferences';
import mpmLogo from '../assets/cover login/logo mpm.webp';

// Lucide icons
import {
  Sprout, LayoutDashboard, Map, BarChart3, History,
  CalendarDays, Bell, Settings, LogOut, Search,
  Droplets, Thermometer, Wifi, Cpu, ChevronRight,
  AlertTriangle, CheckCircle, Waves, Menu, X,
  Play, Square, Home,
  Download,
} from 'lucide-react';

const NAV_LABELS = {
  id: { Dashboard: 'Dashboard', Zona: 'Zona', Grafik: 'Grafik', Riwayat: 'Riwayat', Jadwal: 'Jadwal', Notifikasi: 'Notifikasi', Pengaturan: 'Pengaturan' },
  en: { Dashboard: 'Dashboard', Zona: 'Zones', Grafik: 'Charts', Riwayat: 'History', Jadwal: 'Schedules', Notifikasi: 'Notifications', Pengaturan: 'Settings' },
};

function readPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem('ics-settings-draft') || '{}');
    const system = saved.system || {};
    return {
      language: system.language === 'English' ? 'en' : 'id',
      timezone: safeTimezone(localStorage.getItem('ics-timezone') || TIMEZONES[String(system.timezone || 'WITA').split(' ')[0]] || DEFAULT_TIMEZONE),
      theme: safeTheme(localStorage.getItem('ics-theme') || (system.theme === 'Gelap' ? 'dark' : 'light')),
      autoRefresh: system.autoRefresh || '5 menit',
    };
  } catch { return { language: 'id', timezone: 'Asia/Makassar', theme: 'light', autoRefresh: '5 menit' }; }
}

const initialPreferences = readPreferences();
document.documentElement.dataset.theme = initialPreferences.theme;

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
  const [preferences, setPreferences] = React.useState(initialPreferences);
  const [refreshTick, setRefreshTick] = React.useState(0);
  const [installPrompt, setInstallPrompt] = React.useState(null);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [installHelpOpen, setInstallHelpOpen] = React.useState(false);
  React.useEffect(() => {
    const onPreferencesUpdated = event => {
      const detail = event.detail || {};
      setPreferences(current => ({
        ...current,
        ...detail,
        // SettingsPage stores the human-readable language label, while the
        // shell uses the compact locale key for navigation labels.
        language: detail.language === 'English' || detail.language === 'en' ? 'en' : 'id',
        timezone: safeTimezone(detail.timezone || current.timezone),
        theme: safeTheme(detail.theme || current.theme),
      }));
    };
    window.addEventListener('ics-preferences-updated', onPreferencesUpdated);
    return () => window.removeEventListener('ics-preferences-updated', onPreferencesUpdated);
  }, []);
  React.useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    const minutes = Number.parseInt(preferences.autoRefresh, 10);
    if (!Number.isFinite(minutes)) return undefined;
    const timer = window.setInterval(() => setRefreshTick(tick => tick + 1), minutes * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [preferences.autoRefresh, preferences.theme]);
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
        .then(registration => registration.update())
        .catch(error => console.warn('Service worker tidak dapat didaftarkan:', error));
    }

    const standalone = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsInstalled(standalone);
    const onBeforeInstall = event => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const onInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function handleInstallApp() {
    if (isInstalled) return;
    if (!installPrompt) {
      setInstallHelpOpen(true);
      return;
    }
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice?.outcome === 'accepted') setInstallPrompt(null);
    } catch (error) {
      console.warn('Prompt instalasi tidak dapat dibuka:', error);
      setInstallHelpOpen(true);
    }
  }
  const { data: dashboard = { zones: [] }, loading: dashboardLoading, error: dashboardError } = useApi(`/dashboard?refresh=${refreshTick}`, { zones: [] });
  const { data: notifications = [] } = useApi(`/notifications?refresh=${refreshTick}`, []);
  const { data: persistedSettings } = useApi('/settings', null);
  React.useEffect(() => {
    const system = persistedSettings?.system;
    if (!system) return;
    const timezone = safeTimezone(TIMEZONES[String(system.timezone || 'WITA').split(' ')[0]] || DEFAULT_TIMEZONE);
    const next = { language: system.language === 'English' ? 'en' : 'id', timezone, theme: system.theme === 'Gelap' ? 'dark' : 'light', autoRefresh: system.autoRefresh || '5 menit' };
    setPreferences(current => ({ ...current, ...next }));
    localStorage.setItem('ics-theme', next.theme);
    localStorage.setItem('ics-timezone', next.timezone);
  }, [persistedSettings]);
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
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchIndex, setSearchIndex] = React.useState(0);
  React.useEffect(() => setUnreadCount((Array.isArray(notifications) ? notifications : []).filter(n => !n.read).length), [notifications]);

  const searchResults = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    const zoneResults = zones.filter(zone => [zone.name, zone.plant, zone.id, `zona ${zone.id}`].some(value => String(value ?? '').toLowerCase().includes(query)))
      .map(zone => ({ type: 'zone', id: zone.id, label: `${zone.name || `Zona ${zone.id}`} – ${zone.plant || 'Tanaman belum diatur'}`, detail: `${zone.moisture ?? '—'}% · ${zone.status || 'Status belum tersedia'}` }));
    const notificationResults = (Array.isArray(notifications) ? notifications : []).filter(item => [item.title, item.description, item.zoneName, item.plant].some(value => String(value ?? '').toLowerCase().includes(query)))
      .map(item => ({ type: 'notification', id: item.id, label: item.title || 'Notifikasi', detail: item.zoneName || item.description || 'Notifikasi sistem' }));
    return [...zoneResults, ...notificationResults].slice(0, 8);
  }, [notifications, searchQuery, zones]);

  function selectSearchResult(result) {
    if (!result) return;
    setSearchQuery('');
    setSearchOpen(false);
    setSearchIndex(0);
    if (result.type === 'zone') openZoneDetail(result.id);
    else navigateTo('Notifikasi');
  }

  function handleSearchKeyDown(event) {
    if (!searchOpen || !searchQuery.trim()) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); setSearchIndex(index => Math.min(index + 1, Math.max(searchResults.length - 1, 0))); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setSearchIndex(index => Math.max(index - 1, 0)); }
    if (event.key === 'Enter') { event.preventDefault(); selectSearchResult(searchResults[searchIndex]); }
    if (event.key === 'Escape') { setSearchOpen(false); }
  }

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
            <img className="brand-mark-logo" src={mpmLogo} alt="Logo MPM" />
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
              <span style={{ flex: 1 }}>{NAV_LABELS[preferences.language][label]}</span>
              {label === 'Notifikasi' && unreadCount > 0 && (
                <span className="nav-badge">{unreadCount}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="system-status">
            <span className={`online-dot ${dashboardError || dashboardLoading ? 'offline' : ''}`} />
            <div className="system-status-text">
              <strong>{dashboardLoading ? (preferences.language === 'en' ? 'Checking system' : 'Memeriksa sistem') : dashboardError ? (preferences.language === 'en' ? 'Connection error' : 'Koneksi bermasalah') : (preferences.language === 'en' ? 'System online' : 'Sistem online')}</strong>
              <small>
                {new Intl.DateTimeFormat(preferences.language === 'en' ? 'en-GB' : 'id-ID', { hour: '2-digit', minute: '2-digit', timeZone: preferences.timezone }).format(new Date())}
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

          <div className="search-wrap-container">
          <div className="search-wrap">
            <Search size={15} strokeWidth={1.8} />
            <input
              value={searchQuery}
              placeholder="Cari zona, tanaman, atau notifikasi..."
              onChange={event => { setSearchQuery(event.target.value); setSearchOpen(true); setSearchIndex(0); }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Cari zona, tanaman, atau notifikasi"
              aria-controls="global-search-results"
              aria-expanded={searchOpen}
            />
          </div>
          {searchOpen && searchQuery.trim() && <div id="global-search-results" className="search-results" role="listbox">
            {searchResults.length ? searchResults.map((result, index) => <button key={`${result.type}-${result.id}`} type="button" className={`search-result ${index === searchIndex ? 'active' : ''}`} role="option" aria-selected={index === searchIndex} onMouseDown={event => event.preventDefault()} onClick={() => selectSearchResult(result)}><span className="search-result-type">{result.type === 'zone' ? 'Zona' : 'Notifikasi'}</span><strong>{result.label}</strong><small>{result.detail}</small></button>) : <div className="search-empty" role="status">Tidak ada hasil ditemukan</div>}
          </div>}
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="install-app-button"
              onClick={handleInstallApp}
              aria-label={isInstalled ? 'Aplikasi sudah terpasang' : 'Download Aplikasi'}
              title={isInstalled ? 'Aplikasi sudah terpasang' : 'Download Aplikasi'}
            >
              <Download size={16} strokeWidth={1.9} />
              <span>{isInstalled ? 'Terpasang' : 'Download Aplikasi'}</span>
            </button>
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

        {installHelpOpen && (
          <div className="install-help-overlay" role="presentation" onMouseDown={event => {
            if (event.target === event.currentTarget) setInstallHelpOpen(false);
          }}>
            <section className="install-help-dialog" role="dialog" aria-modal="true" aria-labelledby="install-help-title">
              <div className="install-help-header">
                <div>
                  <span className="install-help-eyebrow">Aplikasi Irigasi Cerdas</span>
                  <h2 id="install-help-title">Instal aplikasi</h2>
                </div>
                <button type="button" className="modal-close-btn" aria-label="Tutup petunjuk instalasi" onClick={() => setInstallHelpOpen(false)}>
                  <X size={17} />
                </button>
              </div>
              <div className="install-help-body">
                <p>Prompt instalasi otomatis belum tersedia di browser ini. Aplikasi tetap dapat dipasang melalui menu browser:</p>
                <ol>
                  <li>Buka menu browser <strong>⋮</strong> atau tombol berbagi.</li>
                  <li>Pilih <strong>Instal aplikasi</strong> atau <strong>Tambahkan ke layar utama</strong>.</li>
                  <li>Konfirmasi pemasangan jika browser memintanya.</li>
                </ol>
                <button type="button" className="primary-btn install-help-action" onClick={() => setInstallHelpOpen(false)}>Mengerti</button>
              </div>
            </section>
          </div>
        )}

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
            onSelectZone={openZoneDetail}
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
              aria-label={NAV_LABELS[preferences.language][label]}
              aria-current={activeNav === label ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={activeNav === label ? 2 : 1.8} />
              <small>{label === 'Dashboard' && preferences.language === 'id' ? 'Beranda' : NAV_LABELS[preferences.language][label]}</small>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}

// ── Dashboard Page ─────────────────────────────────────────────────
function DashboardPage({ zones, loading, selectedZone, setSelectedZone, irrigating, onIrrigationToggle, irrigationSaving, onGoToZona, onSelectZone }) {
  if (loading) return <section className="content"><div className="empty-state">Memuat dashboard dari database...</div></section>;
  const selectedZoneId = Number(String(selectedZone).match(/\d+/)?.[0] || 1);
  const selectedZoneData = zones.find(zone => Number(zone.id) === selectedZoneId);
  const sensorCount = zones.reduce((total, zone) => total + (zone.sensors?.length || 0), 0);
  const onlineSensorCount = zones.reduce((total, zone) => total + (zone.sensors || []).filter(sensor => sensor.status !== 'Offline').length, 0);
  const onlineZoneCount = zones.filter(zone => zone.deviceStatus === 'Online').length;
  return (
    <section className="content">
      {/* Page heading */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">Monitoring Irigasi</div>
          <h1>Dashboard</h1>
          <p>Pantau kondisi lahan dan kendalikan penyiraman dari jarak jauh.</p>
        </div>
        <WeatherWidget />
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
              <button
                type="button"
                key={zone.id}
                className={`field-cell ${(zone.state || zone.status || '').toLowerCase()}`}
                style={{ '--i': i }}
                onClick={() => onSelectZone(zone.id)}
                title={`Zona ${zone.id} – ${zone.plant || 'Tanaman belum diatur'}: ${zone.moisture}% (${zone.state || zone.status})`}
              >
                <span>Z{zone.id}</span>
                <small>{zone.plant || 'Tanaman belum diatur'}</small>
                <em>{zone.moisture}% · {zone.state || zone.status}</em>
              </button>
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
          <DashboardMoistureChart data={zones} />
        </section>

        <div className="dashboard-lower-layout">
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
            <span className={`status-pill ${selectedZoneData?.deviceStatus === 'Online' ? 'success' : 'warning'}`}>
              {selectedZoneData?.deviceStatus || 'Tidak diketahui'}
            </span>
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
            subtitle="Kelembapan terbaru dari 9 zona"
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
            <StatusItem icon={<Cpu size={16} strokeWidth={1.8} />} title="ESP32" value={onlineZoneCount ? `${onlineZoneCount} zona online` : 'Tidak diketahui'} tone={onlineZoneCount ? 'success' : 'warning'} />
            <StatusItem icon={<Wifi size={16} strokeWidth={1.8} />} title="MySQL" value={loading ? 'Memuat' : 'Terhubung'} tone={loading ? 'warning' : 'success'} />
            <StatusItem icon={<Droplets size={16} strokeWidth={1.8} />} title="Sensor" value={`${onlineSensorCount} / ${sensorCount} online`} tone={onlineSensorCount === sensorCount ? 'success' : 'warning'} />
            <StatusItem icon={<Settings size={16} strokeWidth={1.8} />} title="Valve" value={irrigating ? 'Berjalan' : 'Siaga'} tone={irrigating ? 'warning' : 'success'} />
          </div>
          <div className="last-sync">Sinkronisasi terakhir tidak tersedia dari API.</div>
        </section>
        </div>
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
  const zoneLabel = zone.name && zone.plant ? `${zone.name} – ${zone.plant}` : (zone.name || zone.plant || `Zona ${zone.id}`);
  return (
    <div className="zone-row">
      <div className="zone-number">Z{zone.id}</div>
      <div className="zone-name">
        <strong>{zoneLabel}</strong>
        <small>{zone.sensors?.length || 0} sensor</small>
      </div>
      <div className={`zone-state ${state.toLowerCase()}`}>
        <strong>{zone.moisture}%</strong>
        <small>{state}</small>
      </div>
      <span className={`zone-status-dot ${state.toLowerCase()}`} aria-label={`Status ${state}`} />
    </div>
  );
}

function StatusItem({ icon, title, value, tone = 'success' }) {
  return (
    <div className="status-item">
      <span className="status-item-icon">{icon}</span>
      <div>
        <strong>{title}</strong>
        <small>{value}</small>
      </div>
      <span className={`status-dot ${tone}`} style={{ marginLeft: 'auto' }} />
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

const rootElement = document.getElementById('root');
const appRoot = globalThis.__irigasiCerdasRoot || createRoot(rootElement);
globalThis.__irigasiCerdasRoot = appRoot;
appRoot.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
