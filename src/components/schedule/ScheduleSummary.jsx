import React from 'react';
import { CalendarDays, Droplets, Clock, Sprout, TrendingUp, TrendingDown } from 'lucide-react';

/** 4 summary cards di bagian atas halaman Jadwal */
export function ScheduleSummary({ schedules }) {
  const total        = schedules.length;
  const active       = schedules.filter(s => s.active).length;
  const totalDuration = schedules.filter(s => s.active).reduce((a, s) => a + Number(s.duration || 0), 0);
  const totalWater    = schedules.filter(s => s.active).reduce((a, s) => a + Number(s.estimatedWater || 0), 0);

  const cards = [
    { icon: CalendarDays, value: active,               label: 'Jadwal Aktif',          sub: `dari ${total} zona` },
    { icon: Droplets,     value: `${totalWater.toLocaleString('id-ID')} L`,    label: 'Estimasi Air per Hari',  sub: 'dari semua jadwal', change: 'Aktual', up: true },
    { icon: Clock,        value: `${totalDuration} mnt`, label: 'Total Durasi per Hari', sub: 'dari semua jadwal' },
    { icon: Sprout,       value: total,                label: 'Zona Terjadwal',         sub: `dari ${total} zona` },
  ];

  return (
    <div className="sched-summary-grid">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="sched-summary-card">
            <div className="sched-summary-icon">
              <Icon size={20} strokeWidth={1.8} />
            </div>
            <div className="sched-summary-body">
              <div className="sched-summary-value">{c.value}</div>
              <div className="sched-summary-label">{c.label}</div>
              <div className="sched-summary-sub">
                {c.change && (
                  <span className={c.up ? 'kpi-change-up' : 'kpi-change-down'} style={{ marginRight: 6, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                    {c.up
                      ? <TrendingUp size={9} strokeWidth={2} />
                      : <TrendingDown size={9} strokeWidth={2} />
                    } {c.change}
                  </span>
                )}
                <span style={{ fontSize: 9, color: '#a0b8ae' }}>{c.sub}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
