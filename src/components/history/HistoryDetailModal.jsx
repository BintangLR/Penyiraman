import React from 'react';
import { StatusBadge } from './HistoryRow';
import { X, ArrowRight } from 'lucide-react';

/** Modal detail aktivitas penyiraman */
export function HistoryDetailModal({ row, onClose }) {
  React.useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!row) return null;

  const moistureAfterColor = row.moistureAfter >= 50 ? '#10a67a' : '#e55353';

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 520 }} role="dialog" aria-modal="true" aria-labelledby="hist-modal-title">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 id="hist-modal-title" style={{ margin: 0, fontSize: 15, fontWeight: 750, letterSpacing: '-.03em' }}>
              Detail Penyiraman
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 11, color: '#779185' }}>
              {row.zoneName} — {row.plant} · {row.date} {row.time}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup"><X size={15} strokeWidth={2} /></button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ gap: 16 }}>
          {/* Thumbnail + status */}
          <div className="hist-modal-hero">
            <div className="hist-modal-thumb">
              <img src={row.image} alt={row.plant}
                onError={e => { e.target.style.display = 'none'; }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.04em', color: '#17372b', marginBottom: 6 }}>
                {row.zoneName} – {row.plant}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <StatusBadge status={row.status} />
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                  background: '#e9f7ef', color: '#11855f',
                }}>
                  {row.method}
                </span>
              </div>
            </div>
          </div>

          {/* Kelembapan comparison */}
          <div className="hist-modal-moisture-row">
            <div className="hist-modal-moisture-box">
              <div className="hist-modal-moisture-label">Kelembapan Sebelum</div>
              <div className="hist-modal-moisture-val" style={{ color: '#e55353' }}>
                {row.moistureBefore}%
              </div>
              <div style={{ height: 6, background: '#eef2ef', borderRadius: 999, overflow: 'hidden', marginTop: 6 }}>
                <div style={{ height: '100%', width: `${row.moistureBefore}%`, background: '#e55353', borderRadius: 999 }} />
              </div>
            </div>
            <div style={{ color: '#c5d8cc', display: 'flex', alignItems: 'center' }}><ArrowRight size={18} strokeWidth={2} /></div>
            <div className="hist-modal-moisture-box">
              <div className="hist-modal-moisture-label">Kelembapan Sesudah</div>
              <div className="hist-modal-moisture-val" style={{ color: moistureAfterColor }}>
                {row.moistureAfter}%
              </div>
              <div style={{ height: 6, background: '#eef2ef', borderRadius: 999, overflow: 'hidden', marginTop: 6 }}>
                <div style={{ height: '100%', width: `${row.moistureAfter}%`, background: moistureAfterColor, borderRadius: 999 }} />
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="hist-modal-grid">
            <DetailItem label="Tanggal" value={row.date} />
            <DetailItem label="Waktu" value={row.time} />
            <DetailItem label="Durasi" value={`${row.duration} menit`} />
            <DetailItem label="Volume Air" value={`${row.waterVolume} Liter`} />
            <DetailItem label="Metode" value={row.method} />
            <DetailItem label="Status" value={<StatusBadge status={row.status} />} />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="secondary-btn" onClick={onClose} style={{ minWidth: 88 }}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="hist-modal-item">
      <div style={{ fontSize: 9, fontWeight: 700, color: '#779185', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>
        {label}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#17372b' }}>{value}</div>
    </div>
  );
}
