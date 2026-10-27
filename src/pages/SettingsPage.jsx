import React from 'react';
import { AppInformation } from '../components/settings/AppInformation';
import { SystemSettings } from '../components/settings/SystemSettings';
import { WateringSettings } from '../components/settings/WateringSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { DataSettings } from '../components/settings/DataSettings';
import { AccountSettings, ZoneSettings, SensorSettings, UserSettings } from '../components/settings/AccountSettings';
import { ConfirmDialog } from '../components/schedule/ConfirmDialog';
import { useApi, api } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Default state (strukturnya siap untuk Firebase)
const DEFAULT_ACCOUNT = {
  name: 'Michael Sonda', email: 'admin@irigasicerdas.id', password: '••••••••••••',
};
const DEFAULT_SYSTEM = {
  language: 'Bahasa Indonesia', timezone: 'WITA (UTC+8)', theme: 'Terang', autoRefresh: '5 menit',
};
const DEFAULT_WATERING = {
  defaultDuration: '10 menit', flowRate: '1.2 Liter/menit', moistureMin: 30, moistureOptimal: 70,
};
const DEFAULT_NOTIFS = {
  lowMoisture: true, wateringDone: true, deviceOffline: true, highWater: true, skipSched: true,
};

const TABS = [
  { key: 'umum',    label: 'Umum' },
  { key: 'zona',    label: 'Zona & Tanaman' },
  { key: 'sensor',  label: 'Sensor & Perangkat' },
  { key: 'notif',   label: 'Notifikasi' },
  { key: 'sistem',  label: 'Sistem' },
  { key: 'pengguna',label: 'Pengguna' },
];

/**
 * Halaman Pengaturan — layout 3-kolom seperti reference image dengan tab navigasi.
 */
export function SettingsPage({ onNavigate }) {
  const { currentUser, updateUser } = useAuth();
  const { data: savedSettings, loading, error } = useApi('/settings', null);
  const [activeTab, setActiveTab] = React.useState('umum');

  // State tiap section
  const [account,  setAccount]  = React.useState(DEFAULT_ACCOUNT);
  const [system,   setSystem]   = React.useState(DEFAULT_SYSTEM);
  const [watering, setWatering] = React.useState(DEFAULT_WATERING);
  const [notifs,   setNotifs]   = React.useState(DEFAULT_NOTIFS);

  // Saved feedback
  const [savedAcc,  setSavedAcc]  = React.useState(false);
  const [savedSys,  setSavedSys]  = React.useState(false);
  const [savedWat,  setSavedWat]  = React.useState(false);

  // Confirm reset dialog
  const [resetOpen, setResetOpen] = React.useState(false);
  const [exportDone, setExportDone] = React.useState(false);
  const settingsRef = React.useRef({ account: DEFAULT_ACCOUNT, system: DEFAULT_SYSTEM, watering: DEFAULT_WATERING, notifs: DEFAULT_NOTIFS });
  const saveTimerRef = React.useRef(null);

  React.useEffect(() => {
    if (!savedSettings) return;
    const next = {
      account: savedSettings.account || DEFAULT_ACCOUNT,
      system: savedSettings.system || DEFAULT_SYSTEM,
      watering: savedSettings.watering || DEFAULT_WATERING,
      notifs: savedSettings.notifs || DEFAULT_NOTIFS,
    };
    settingsRef.current = next;
    setAccount(next.account);
    setSystem(next.system);
    setWatering(next.watering);
    setNotifs(next.notifs);
  }, [savedSettings]);

  React.useEffect(() => () => clearTimeout(saveTimerRef.current), []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function persistSettings(next) {
    settingsRef.current = next;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      api.put('/settings', next).catch(error => console.error('Gagal menyimpan pengaturan:', error));
    }, 400);
  }

  function updateSetting(section, key, val) {
    const next = {
      ...settingsRef.current,
      [section]: { ...settingsRef.current[section], [key]: val },
    };
    if (section === 'account') setAccount(next.account);
    if (section === 'system') setSystem(next.system);
    if (section === 'watering') setWatering(next.watering);
    if (section === 'notifs') setNotifs(next.notifs);
    persistSettings(next);
  }

  function handleAccountChange(key, val) {
    updateSetting('account', key, val);
    if (currentUser?.id && ['name', 'email', 'password'].includes(key)) {
      api.put(`/users/${currentUser.id}`, { [key]: val }).then(user => {
        if (user) updateUser(user);
      }).catch(error => console.error('Gagal menyimpan akun:', error));
    }
  }
  function handleSystemChange(key, val)  { updateSetting('system', key, val); }
  function handleWateringChange(key, val){ updateSetting('watering', key, val); }
  function handleNotifChange(key, val)   { updateSetting('notifs', key, val); }

  function flashSave(setter) {
    persistSettings(settingsRef.current);
    setter(true);
    setTimeout(() => setter(false), 2000);
  }

  function handleDataAction(key) {
    if (key === 'reset') { setResetOpen(true); return; }
    if (key === 'export') {
      api.get('/zones').then(zones => {
        const headers = ['ID', 'Zona', 'Tanaman', 'Luas', 'Kelembapan', 'Status'];
        const rows = zones.map(z => [z.id, z.name, z.plant, z.area, z.moisture, z.status]);
        const csv = [headers, ...rows].map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'data_irigasi.csv'; a.click();
        URL.revokeObjectURL(url);
        setExportDone(true); setTimeout(() => setExportDone(false), 2500);
      }).catch(err => console.error('Gagal export data:', err));
      return;
    }
    if (key === 'import') {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = '.csv,.json';
      inp.onchange = async event => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
          const text = await file.text();
          const imported = file.name.toLowerCase().endsWith('.json')
            ? JSON.parse(text)
            : text.trim().split(/\r?\n/).slice(1).map(line => {
                const [id, name, plant, area, moisture, status] = line.split(',').map(value => value.replace(/^"|"$/g, ''));
                return { id: Number(id), name, plant, area, moisture: Number(moisture), status };
              });
          const rows = Array.isArray(imported) ? imported : imported.zones;
          await Promise.all(rows.filter(row => row.id).map(row => api.put(`/zone/${row.id}`, row)));
          setExportDone(true); setTimeout(() => setExportDone(false), 2500);
        } catch (err) { console.error('Gagal import data:', err); }
      };
      inp.click();
    }
  }

  function handleReset() {
    const next = {
      account: DEFAULT_ACCOUNT,
      system: DEFAULT_SYSTEM,
      watering: DEFAULT_WATERING,
      notifs: DEFAULT_NOTIFS,
    };
    settingsRef.current = next;
    setAccount(next.account);
    setSystem(next.system);
    setWatering(next.watering);
    setNotifs(next.notifs);
    clearTimeout(saveTimerRef.current);
    api.put('/settings', next);
    setResetOpen(false);
  }

  // ── Tab content renderer ───────────────────────────────────────────────────
  function renderTabContent() {
    if (activeTab === 'zona') return (
      <div className="set-single-col">
        <ZoneSettings onOpen={() => onNavigate ? onNavigate('Zona') : setActiveTab('zona')} />
      </div>
    );
    if (activeTab === 'sensor') return (
      <div className="set-single-col">
        <SensorSettings onOpen={() => setActiveTab('sensor')} />
      </div>
    );
    if (activeTab === 'notif') return (
      <div className="set-single-col">
        <NotificationSettings notifs={notifs} onChange={handleNotifChange} />
      </div>
    );
    if (activeTab === 'sistem') return (
      <div className="set-single-col">
        <SystemSettings settings={system} onChange={handleSystemChange}
          onSave={() => flashSave(setSavedSys)} saved={savedSys} />
      </div>
    );
    if (activeTab === 'pengguna') return (
      <div className="set-single-col">
        <AccountSettings account={account} onChange={handleAccountChange}
          onSave={() => flashSave(setSavedAcc)} saved={savedAcc} />
        <UserSettings onOpen={() => setActiveTab('pengguna')} />
      </div>
    );

    // Default: Umum — 3-column layout matching reference image
    return (
      <div className="set-three-col">
        {/* Col 1 */}
        <div className="set-col">
          <AppInformation />
          <ZoneSettings onOpen={() => onNavigate ? onNavigate('Zona') : setActiveTab('zona')} />
          <UserSettings onOpen={() => setActiveTab('pengguna')} />
        </div>

        {/* Col 2 */}
        <div className="set-col">
          <SystemSettings settings={system} onChange={handleSystemChange}
            onSave={() => flashSave(setSavedSys)} saved={savedSys} />
          <SensorSettings onOpen={() => setActiveTab('sensor')} />
          <DataSettings onAction={handleDataAction} />
        </div>

        {/* Col 3 */}
        <div className="set-col">
          <WateringSettings settings={watering} onChange={handleWateringChange}
            onSave={() => flashSave(setSavedWat)} saved={savedWat} />
          <NotificationSettings notifs={notifs} onChange={handleNotifChange} />
        </div>
      </div>
    );
  }

  return (
    <section className="content">
      {loading && <div className="empty-state">Memuat pengaturan dari database...</div>}
      {error && <div className="empty-state">Database belum terhubung: {error}</div>}
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <div className="eyebrow">KONFIGURASI SISTEM</div>
        <h1>Pengaturan</h1>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#779185' }}>
          Kelola akun, konfigurasi dasar sistem, dan preferensi aplikasi.
        </p>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="set-tab-bar">
        {TABS.map(t => (
          <button
            key={t.key}
            id={`set-tab-${t.key}`}
            className={activeTab === t.key ? 'set-tab active' : 'set-tab'}
            onClick={() => setActiveTab(t.key)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 20 }}>
        {renderTabContent()}
      </div>

      {/* ── Confirm reset modal ─────────────────────────────────────────── */}
      <ConfirmDialog
        open={resetOpen}
        title="Reset ke Pengaturan Awal?"
        message="Semua konfigurasi akan dikembalikan ke pengaturan default. Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleReset}
        onCancel={() => setResetOpen(false)}
      />
    </section>
  );
}
