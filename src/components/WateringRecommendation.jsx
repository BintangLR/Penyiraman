import React from 'react';
import { getWateringRecommendation } from '../data/zonesData';
import { Droplets, CheckCircle, Circle, Play, Square, CalendarDays } from 'lucide-react';

/**
 * Card rekomendasi penyiraman.
 */
export function WateringRecommendation({ zone, onWater, onSchedule, irrigating, setIrrigating, saving = false }) {
  const rec = getWateringRecommendation(zone);

  const urgencyConfig = {
    high:   { bg: '#fff5f5', border: '#f7c5c5', icon: Droplets,     iconBg: '#fdeeee', iconColor: '#d63f3f' },
    medium: { bg: '#f6fdf9', border: '#c5e8d6', icon: CheckCircle,  iconBg: '#e7f7ee', iconColor: '#11855f' },
    low:    { bg: '#edf4ff', border: '#c5d8f8', icon: Circle,       iconBg: '#ddeeff', iconColor: '#2878d6' },
  };
  const conf = urgencyConfig[rec.urgency];
  const IconComp = conf.icon;

  return (
    <div className="detail-card" style={{ background: conf.bg, borderColor: conf.border }}>
      <div className="detail-card-header" style={{ marginBottom: 14 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: conf.iconBg, color: conf.iconColor,
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <IconComp size={18} strokeWidth={1.8} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '-.02em' }}>
            Rekomendasi Penyiraman
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#779185', lineHeight: 1.4 }}>
            {rec.message}
          </p>
        </div>
      </div>

      <div className="rec-reason">{rec.reason}</div>

      <div className="rec-grid">
        <RecItem label="Estimasi kebutuhan air"  value={zone.status === 'Basah' ? '— liter' : `± ${zone.estimatedWater} liter`} />
        <RecItem label="Target kelembapan"        value={`${zone.targetMoistureMin}% – ${zone.targetMoistureMax}%`} />
        <RecItem label="Durasi penyiraman"        value={zone.status === 'Basah' ? '—' : `${zone.irrigationDuration} menit`} />
        <RecItem label="Kondisi sekarang"         value={`${zone.moisture}% (${zone.status})`} />
      </div>

      <div className="rec-actions">
        <button
          id={`btn-water-now-${zone.id}`}
          className={`primary-btn${irrigating ? ' stop' : ''}`}
          style={{ flex: 1, gap: 8 }}
          onClick={onWater || (() => setIrrigating(v => !v))}
          disabled={saving || (zone.status === 'Basah' && !irrigating)}
        >
          {irrigating
            ? <><Square size={14} strokeWidth={2} />{saving ? 'Menyimpan...' : 'Hentikan Penyiraman'}</>
            : <><Play size={14} strokeWidth={2} />{saving ? 'Menyimpan...' : 'Siram Sekarang'}</>
          }
        </button>
        <button
          id={`btn-schedule-${zone.id}`}
          className="secondary-btn"
          style={{ flex: 1, gap: 8 }}
          onClick={onSchedule}
        >
          <CalendarDays size={14} strokeWidth={1.8} />Atur Jadwal
        </button>
      </div>

      {irrigating && (
        <div className="irrigating-indicator">
          <span className="pulsing-dot" />
          Penyiraman sedang berjalan... Tekan "Hentikan" untuk menghentikan.
        </div>
      )}
    </div>
  );
}

function RecItem({ label, value }) {
  return (
    <div className="rec-item">
      <div className="rec-item-label">{label}</div>
      <div className="rec-item-value">{value}</div>
    </div>
  );
}
