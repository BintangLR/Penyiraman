import React from 'react';
import { CalendarDays, Droplet, Droplets, Timer, TrendingUp } from 'lucide-react';

/** 4 summary card ringkasan riwayat */
export function HistorySummary({ history = [] }) {
  const completed = history.filter(row => row.status === 'Selesai');
  const totalWater = history.reduce((sum, row) => sum + Number(row.waterVolume || 0), 0);
  const totalDuration = history.reduce((sum, row) => sum + Number(row.duration || 0), 0);
  const days = new Set(history.map(row => row.date).filter(Boolean)).size || 1;
  const summary = [
    { id: 'total', icon: Droplets, value: `${history.length} kali`, label: 'Total Penyiraman', change: `${completed.length} selesai`, up: true, sub: 'Dari database' },
    { id: 'water', icon: Droplet, value: `${totalWater.toLocaleString('id-ID')} Liter`, label: 'Total Air Digunakan', change: 'Aktual', up: true, sub: 'Dari database' },
    { id: 'duration', icon: Timer, value: `${totalDuration.toLocaleString('id-ID')} menit`, label: 'Total Durasi', change: 'Aktual', up: true, sub: 'Dari database' },
    { id: 'avg', icon: CalendarDays, value: `${(history.length / days).toFixed(1)} kali`, label: 'Rata-rata per Hari', change: `${days} hari`, up: true, sub: 'Periode data' },
  ];
  return (
    <div className="hist-summary-grid">
      {summary.map(item => (
        <div key={item.id} className="hist-summary-card">
          <div className="hist-summary-icon"><item.icon size={25} strokeWidth={1.8} aria-hidden="true" /></div>
          <div className="hist-summary-body">
            <div className="hist-summary-value">{item.value}</div>
            <div className="hist-summary-label">{item.label}</div>
            <div className="hist-summary-change">
              <span className="kpi-change-up">
                <TrendingUp size={12} strokeWidth={2} /> {item.change}
              </span>
              <span className="kpi-sub">{item.sub}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
