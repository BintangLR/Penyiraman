import React from 'react';
import { AlertTriangle, Bell, Cpu, CheckCircle } from 'lucide-react';

/** 4 summary card ringkasan notifikasi */
export function NotificationSummary({ items }) {
  const warning = items.filter(n => n.category === 'Peringatan').length;
  const info    = items.filter(n => n.category === 'Penyiraman').length;
  const system  = items.filter(n => n.category === 'Sistem').length;
  const done    = items.filter(n => n.read).length;

  const cards = [
    { icon: AlertTriangle, value: warning, label: 'Peringatan',         sub: 'Perlu ditindaklanjuti', bg: '#fdeeee', ic: '#d63f3f' },
    { icon: Bell,          value: info,    label: 'Penyiraman',         sub: 'Aktivitas penyiraman',  bg: '#fff4e5', ic: '#b45309' },
    { icon: Cpu,           value: system,  label: 'Sistem',             sub: 'Status perangkat',      bg: '#e9f7ef', ic: '#10a67a' },
    { icon: CheckCircle,   value: done,    label: 'Sudah Ditangani',    sub: 'Notifikasi selesai',    bg: '#e9f3ff', ic: '#2878d6' },
  ];

  return (
    <div className="notif-summary-grid">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="notif-summary-card">
            <div className="notif-summary-icon" style={{ background: c.bg }}>
              <Icon size={20} strokeWidth={1.8} color={c.ic} />
            </div>
            <div>
              <div className="notif-summary-value">{c.value}</div>
              <div className="notif-summary-label">{c.label}</div>
              <div className="notif-summary-sub">{c.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
