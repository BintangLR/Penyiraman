import React from 'react';
import { CheckCircle2, PauseCircle, Clock, Droplets } from 'lucide-react';

/** Ringkasan jadwal — sidebar kanan */
export function ScheduleSummaryCard({ schedules }) {
  const active   = schedules.filter(s => s.active).length;
  const inactive = schedules.filter(s => !s.active).length;
  const totalDur = schedules.filter(s => s.active).reduce((a, s) => a + Number(s.duration || 0), 0);
  const totalWtr = schedules.filter(s => s.active).reduce((a, s) => a + Number(s.estimatedWater || 0), 0);

  const rows = [
    { icon: CheckCircle2, label: 'Jadwal Aktif',          value: `${active} zona`,    color: '#10a67a', bg: '#e7f7ee' },
    { icon: PauseCircle,  label: 'Jadwal Nonaktif',       value: `${inactive} zona`,  color: '#779185', bg: '#f4f8f5' },
    { icon: Clock,        label: 'Total Durasi',          value: `${totalDur} menit`, color: '#f59e0b', bg: '#fff4e5' },
    { icon: Droplets,     label: 'Estimasi Air per Hari', value: `${totalWtr.toLocaleString('id-ID')} Liter`, color: '#2878d6', bg: '#edf4ff' },
  ];

  return (
    <div className="graph-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 className="graph-card-title">Ringkasan Jadwal</h2>
        <span className="period-badge">Semua Zona</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map(r => {
          const Icon = r.icon;
          return (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f7faf8', borderRadius: 10, border: '1px solid #eef2ef' }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} strokeWidth={1.8} color={r.color} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: '#779185', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{r.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: r.color, letterSpacing: '-.03em', marginTop: 1 }}>{r.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
