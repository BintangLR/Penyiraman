import React from 'react';
import { AlertTriangle, Droplets, WifiOff, BarChart2, CalendarDays } from 'lucide-react';

const NOTIF_ITEMS = [
  { key: 'lowMoisture',   icon: AlertTriangle, label: 'Peringatan Kelembapan Rendah', sub: 'Notifikasi saat kelembapan < ambang batas',   color: '#e55353' },
  { key: 'wateringDone',  icon: Droplets,      label: 'Penyiraman Selesai',           sub: 'Notifikasi saat penyiraman selesai',            color: '#2878d6' },
  { key: 'deviceOffline', icon: WifiOff,       label: 'Perangkat Offline',            sub: 'Notifikasi saat perangkat offline',             color: '#f59e0b' },
  { key: 'highWater',     icon: BarChart2,     label: 'Penggunaan Air Tinggi',        sub: 'Notifikasi saat volume air melebihi batas',     color: '#8b5cf6' },
  { key: 'skipSched',     icon: CalendarDays,  label: 'Jadwal Dilewati',              sub: 'Notifikasi saat jadwal tidak dijalankan',        color: '#10a67a' },
];

/** Card pengaturan notifikasi dengan 5 toggle interaktif */
export function NotificationSettings({ notifs, onChange }) {
  return (
    <div className="set-card">
      <div className="set-card-header">
        <h3 className="set-card-title">Pengaturan Notifikasi</h3>
        <p className="set-card-sub">Atur jenis notifikasi yang ingin diterima.</p>
      </div>

      <div className="set-notif-list">
        {NOTIF_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="set-notif-row">
              <div className="set-notif-icon" style={{ background: item.color + '18' }}>
                <Icon size={16} strokeWidth={1.8} color={item.color} />
              </div>
              <div className="set-notif-body">
                <div className="set-notif-label">{item.label}</div>
                <div className="set-notif-sub">{item.sub}</div>
              </div>
              <button
                id={`notif-toggle-${item.key}`}
                role="switch"
                aria-checked={notifs[item.key]}
                aria-label={item.label}
                className={notifs[item.key] ? 'set-pill-toggle on' : 'set-pill-toggle off'}
                onClick={() => onChange(item.key, !notifs[item.key])}
                type="button"
              >
                <span className="set-pill-knob" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
