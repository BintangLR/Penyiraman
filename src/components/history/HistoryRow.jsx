import React from 'react';
import { Eye, ChevronRight, Droplets, Droplet, Clock } from 'lucide-react';

/** Badge status penyiraman */
export function StatusBadge({ status }) {
  const map = {
    Selesai:    { bg: '#e7f7ee', color: '#11855f' },
    Berjalan:   { bg: '#fff4e5', color: '#b45309' },
    Gagal:      { bg: '#fdeeee', color: '#d63f3f' },
    Dibatalkan: { bg: '#f3f4f6', color: '#6b7280' },
  };
  const s = map[status] || map.Dibatalkan;
  return (
    <span style={{
      display: 'inline-block',
      background: s.bg, color: s.color,
      fontSize: 9, fontWeight: 800,
      padding: '3px 10px', borderRadius: 999,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
}

/** Satu baris tabel (desktop) */
export function HistoryRow({ row, index, onDetail }) {
  return (
    <tr className="history-row" key={row.id}>
      <td className="hist-td-no">{index}</td>
      <td className="history-datetime">{row.date} {row.time}</td>
      <td><strong style={{ fontSize: 11 }}>{row.zoneName}</strong></td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="hist-plant-thumb">
            <img src={row.image} alt={row.plant} loading="lazy"
              onError={e => { e.target.style.display = 'none'; }} />
          </div>
          <span style={{ fontSize: 11 }}>{row.plant}</span>
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 36, height: 4, background: '#eef2ef', borderRadius: 999, overflow: 'hidden', flexShrink: 0 }}>
            <div style={{
              height: '100%',
              width: `${row.moistureBefore}%`,
              background: row.moistureBefore < 40 ? '#e55353' : '#10a67a',
              borderRadius: 999,
            }} />
          </div>
          <span style={{ fontSize: 11 }}>{row.moistureBefore}%</span>
        </div>
      </td>
      <td style={{ fontSize: 11 }}>{row.duration} menit</td>
      <td style={{ fontSize: 11 }}>{row.waterVolume} Liter</td>
      <td><StatusBadge status={row.status} /></td>
      <td>
        <button
          className="hist-action-btn"
          onClick={() => onDetail(row)}
          title="Lihat detail"
          aria-label={`Detail penyiraman ${row.zoneName}`}
        >
          <Eye size={16} strokeWidth={1.8} />
        </button>
      </td>
    </tr>
  );
}

/** Card mobile untuk satu record */
export function HistoryMobileCard({ row, onDetail }) {
  return (
    <div className="hist-mobile-card">
      <div className="hist-mobile-card-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <div className="hist-mobile-thumb">
            <img src={row.image} alt={row.plant} loading="lazy"
              onError={e => { e.target.style.display = 'none'; }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="hist-mobile-zone">{row.zoneName} – {row.plant}</div>
            <div className="hist-mobile-date">{row.date} • {row.time}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <StatusBadge status={row.status} />
          <button className="hist-action-btn" onClick={() => onDetail(row)} aria-label="Detail"><ChevronRight size={14} strokeWidth={2} /></button>
        </div>
      </div>
      <div className="hist-mobile-card-body">
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Droplets size={12} /> Kelembapan {row.moistureBefore}%</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Droplet size={12} /> {row.waterVolume} Liter</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {row.duration} menit</span>
      </div>
    </div>
  );
}
