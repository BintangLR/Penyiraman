import React from 'react';
import { PasswordField } from './PasswordField';
import { useApi, api } from '../../services/api';
import { Map, Sprout, Sliders, Droplets, Settings, Radio, User, Shield, ChevronRight, Check, Plus, Trash2, ExternalLink } from 'lucide-react';

const ZONE_MENU = [
  { icon: Map,      label: 'Data Zona Lahan',   sub: 'Kelola 9 zona lahan' },
  { icon: Sprout,   label: 'Jenis Tanaman',     sub: 'Atur jenis tanaman dan parameter' },
  { icon: Sliders,  label: 'Ambang Kelembapan', sub: 'Atur batas kelembapan setiap tanaman' },
];
const SENSOR_MENU = [
  { icon: Droplets, label: 'Sensor Kelembapan', sub: 'Status dan konfigurasi sensor' },
  { icon: Settings, label: 'Kontrol Pompa',     sub: 'Pengaturan pompa air' },
  { icon: Radio,    label: 'Perangkat IoT',     sub: 'Kelola koneksi ESP32 dan perangkat' },
];
const USER_MENU = [
  { icon: User,   label: 'Akun Pengguna', sub: 'Tambah, edit, dan hapus pengguna' },
  { icon: Shield, label: 'Hak Akses',     sub: 'Atur peran dan izin pengguna' },
];

function SettingsMenuList({ items, prefix, onItemClick }) {
  return (
    <div className="set-menu-list">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <button key={i} id={`${prefix}-${i}`} className="set-menu-item" type="button" onClick={() => onItemClick?.(item)}>
            <span className="set-menu-icon">
              <Icon size={16} strokeWidth={1.8} />
            </span>
            <div className="set-menu-body">
              <div className="set-menu-label">{item.label}</div>
              <div className="set-menu-sub">{item.sub}</div>
            </div>
            <span className="set-menu-arrow">
              <ChevronRight size={15} strokeWidth={1.8} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Card Kelola Akun (edit nama/email/password) */
export function AccountSettings({ account, onChange, onSave, saved }) {
  return (
    <div className="set-card">
      <div className="set-card-header">
        <h3 className="set-card-title">Kelola Akun</h3>
        <p className="set-card-sub">Ubah informasi akun administrator.</p>
      </div>

      <div className="set-avatar-row">
        <div className="set-avatar">
          {account.name ? account.name.slice(0, 2).toUpperCase() : 'MS'}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#17372b' }}>
            {account.name || 'Michael Sonda'}
          </div>
          <div style={{ fontSize: 10, color: '#779185' }}>Administrator</div>
        </div>
      </div>

      <div className="set-field-group">
        <label className="set-field-label" htmlFor="set-acc-name">Nama Admin</label>
        <input id="set-acc-name" className="set-input" type="text"
          value={account.name} onChange={e => onChange('name', e.target.value)} />
      </div>

      <div className="set-field-group">
        <label className="set-field-label" htmlFor="set-acc-email">Email</label>
        <input id="set-acc-email" className="set-input" type="email"
          value={account.email} onChange={e => onChange('email', e.target.value)} />
      </div>

      <PasswordField id="set-acc-pw" label="Password"
        value={account.password}
        onChange={v => onChange('password', v)} />

      <button className="set-save-btn" onClick={onSave} type="button" id="btn-save-account">
        {saved
          ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Check size={16} strokeWidth={2.5} /> Tersimpan
            </span>
          : 'Simpan Perubahan'
        }
      </button>
    </div>
  );
}

/** Card Kelola Zona dan Tanaman */
export function ZoneSettings({ onOpen }) {
  return (
    <div className="set-card">
      <div className="set-card-header">
        <h3 className="set-card-title">Kelola Zona dan Tanaman</h3>
        <p className="set-card-sub">Atur informasi zona lahan dan jenis tanaman.</p>
      </div>
      <SettingsMenuList items={ZONE_MENU} prefix="zone-menu" onItemClick={onOpen} />
      <button type="button" className="secondary-btn" onClick={onOpen} style={{ width: '100%', marginTop: 12 }}>
        <ExternalLink size={14} /> Buka Pengelolaan Zona
      </button>
    </div>
  );
}

/** Card Sensor & Perangkat */
export function SensorSettings({ onOpen }) {
  const { data: zones = [], loading } = useApi('/zones', []);
  const sensors = zones.flatMap(zone => zone.sensors || []);
  const online = sensors.filter(sensor => !['Offline', 'Bermasalah'].includes(sensor.status)).length;
  return (
    <div className="set-card">
      <div className="set-card-header">
        <h3 className="set-card-title">Pengaturan Sensor & Perangkat</h3>
        <p className="set-card-sub">Kelola perangkat dan sensor yang terhubung.</p>
      </div>
      <SettingsMenuList items={SENSOR_MENU} prefix="sensor-menu" onItemClick={onOpen} />
      <div style={{ marginTop: 12, padding: 10, background: '#f5faf7', borderRadius: 10, fontSize: 11, color: '#527468' }}>
        {loading ? 'Memuat sensor...' : `${online}/${sensors.length} sensor normal dari ${zones.length} zona`}
      </div>
    </div>
  );
}

/** Card Manajemen Pengguna */
export function UserSettings({ onOpen }) {
  const { data: users = [], setData: setUsers, loading } = useApi('/users', []);
  const [form, setForm] = React.useState({ username: '', name: '', email: '', password: '', role: 'Operator' });
  const [editingId, setEditingId] = React.useState(null);
  const [message, setMessage] = React.useState('');

  function change(key, value) { setForm(previous => ({ ...previous, [key]: value })); }
  async function saveUser(event) {
    event.preventDefault();
    try {
      const saved = editingId
        ? await api.put(`/users/${editingId}`, form)
        : await api.post('/users', form);
      setUsers(previous => editingId ? previous.map(user => user.id === editingId ? { ...user, ...saved } : user) : [...previous, saved]);
      setForm({ username: '', name: '', email: '', password: '', role: 'Operator' });
      setEditingId(null); setMessage('User berhasil disimpan.');
    } catch (error) { setMessage(error.message); }
  }
  async function removeUser(id) {
    try { await api.delete(`/users/${id}`); setUsers(previous => previous.filter(user => user.id !== id)); setMessage('User berhasil dihapus.'); }
    catch (error) { setMessage(error.message); }
  }
  return (
    <div className="set-card">
      <div className="set-card-header">
        <h3 className="set-card-title">Manajemen Pengguna</h3>
        <p className="set-card-sub">Kelola akun pengguna dan hak akses.</p>
      </div>
      <SettingsMenuList items={USER_MENU} prefix="user-menu" onItemClick={onOpen} />
      <form onSubmit={saveUser} style={{ marginTop: 14, display: 'grid', gap: 8 }}>
        <strong style={{ fontSize: 11 }}>{editingId ? 'Edit User' : 'Tambah User'}</strong>
        {!editingId && <input className="set-input" placeholder="Username" value={form.username} onChange={e => change('username', e.target.value)} required />}
        <input className="set-input" placeholder="Nama lengkap" value={form.name} onChange={e => change('name', e.target.value)} required />
        <input className="set-input" type="email" placeholder="Email" value={form.email} onChange={e => change('email', e.target.value)} />
        <input className="set-input" type="password" placeholder={editingId ? 'Password baru (opsional)' : 'Password'} value={form.password} onChange={e => change('password', e.target.value)} required={!editingId} />
        <select className="set-select" value={form.role} onChange={e => change('role', e.target.value)}><option>Operator</option><option>Administrator</option></select>
        <button className="primary-btn" type="submit"><Plus size={14} /> {editingId ? 'Simpan User' : 'Tambah User'}</button>
        {editingId && <button className="secondary-btn" type="button" onClick={() => { setEditingId(null); setForm({ username: '', name: '', email: '', password: '', role: 'Operator' }); }}>Batal Edit</button>}
      </form>
      {message && <div style={{ marginTop: 8, fontSize: 10, color: '#11855f' }}>{message}</div>}
      <div style={{ marginTop: 14, display: 'grid', gap: 6 }}>
        {loading ? <small>Memuat pengguna...</small> : users.map(user => (
          <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderTop: '1px solid #eef3f0' }}>
            <div style={{ flex: 1, minWidth: 0 }}><strong style={{ fontSize: 11 }}>{user.name}</strong><small style={{ display: 'block', color: '#779185' }}>@{user.username} · {user.role}</small></div>
            <button className="text-button" type="button" onClick={() => { setEditingId(user.id); setForm({ username: user.username, name: user.name, email: user.email || '', password: '', role: user.role }); }}>Edit</button>
            <button className="text-button" type="button" onClick={() => removeUser(user.id)} aria-label={`Hapus ${user.username}`}><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
