import React from 'react';
import { NOTIF_TYPE_CONFIG } from '../../data/notificationData';

/** Detail panel notifikasi — ditampilkan di sebelah kanan (desktop) atau modal (mobile) */
export function NotificationDetail({ item, onClose, onNavigate }) {
  if (!item) return (
    <div className="notif-detail-empty">
      <div style={{ fontSize: 48, opacity: .25 }}>🔔</div>
      <div style={{ fontSize: 12, color: '#95a8a0', marginTop: 10, textAlign: 'center' }}>
        Pilih notifikasi untuk<br />melihat detail
      </div>
    </div>
  );

  const cfg = NOTIF_TYPE_CONFIG[item.type] || NOTIF_TYPE_CONFIG.system;
  const isWarning = item.type === 'warning';
  const hasZone   = item.zoneId && item.image;

  function handleAction(action) {
    if (action === 'riwayat')  onNavigate('Riwayat');
    if (action === 'jadwal')   onNavigate('Jadwal');
    if (action === 'zona')     onNavigate('Zona');
    if (action === 'settings') onNavigate('Pengaturan');
  }

  return (
    <div className="notif-detail-panel">
      {/* Header */}
      <div className="notif-detail-header">
        <h3 className="notif-detail-heading">Detail Notifikasi</h3>
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup detail">✕</button>
      </div>

      {/* Notification title block */}
      <div className="notif-detail-title-block">
        <div className="notif-detail-icon" style={{ background: cfg.bg }}>
          <span style={{ color: cfg.color, fontSize: 22 }}>{cfg.icon}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="notif-detail-title">{item.title}</div>
          {item.zoneName && <div className="notif-detail-zone">{item.zoneName}{item.plant ? ` – ${item.plant}` : ''}</div>}
          <div className="notif-detail-date">{item.date} {item.time}</div>
          <span className="notif-type-badge" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
        </div>
      </div>

      {/* Description */}
      <div className="notif-detail-section">
        <div className="notif-detail-section-title">Deskripsi</div>
        <p className="notif-detail-desc">{item.description}</p>

        {isWarning && (
          <div className="notif-warning-box">
            ⚠ Disarankan untuk segera melakukan penyiraman atau menunggu penyiraman otomatis sesuai jadwal.
          </div>
        )}
      </div>

      {/* Zone info */}
      {hasZone && (
        <div className="notif-detail-section">
          <div className="notif-detail-section-title">Informasi Zona</div>
          <div className="notif-zone-card">
            <div className="notif-zone-thumb">
              <img src={item.image} alt={item.plant} loading="lazy"
                onError={e => { e.target.style.display = 'none'; }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 750, fontSize: 12, color: '#17372b' }}>
                {item.zoneName} – {item.plant}
              </div>
              <div style={{ fontSize: 10, color: '#779185', marginBottom: 8 }}>{item.plantType}</div>
              {item.moisture != null && (
                <>
                  <div style={{ height: 6, background: '#eef2ef', borderRadius: 999, overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{
                      height: '100%',
                      width: `${item.moisture}%`,
                      background: item.moisture < (item.threshold || 30) ? '#e55353' : '#10a67a',
                      borderRadius: 999,
                    }} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: item.moisture < (item.threshold || 30) ? '#e55353' : '#10a67a' }}>
                    {item.moisture}%
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Ambang + Kondisi */}
          {item.moisture != null && item.threshold != null && (
            <div className="notif-moisture-row">
              <div className="notif-moisture-box">
                <div className="notif-moisture-label">Ambang Batas</div>
                <div className="notif-moisture-val" style={{ color: '#e55353' }}>{item.threshold}%</div>
              </div>
              <div className="notif-moisture-box">
                <div className="notif-moisture-label">Kondisi Saat Ini</div>
                <div className="notif-moisture-val" style={{ color: item.moisture < item.threshold ? '#e55353' : '#10a67a' }}>
                  {item.moisture}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="notif-detail-section">
        <div className="notif-detail-section-title">Tindakan</div>
        <div className="notif-actions-row">
          {isWarning && (
            <button className="primary-btn notif-action-btn" type="button" onClick={() => handleAction('jadwal')}
              id="btn-notif-siram">
              💧 Siram Sekarang
            </button>
          )}
          {(item.type === 'warning' || item.type === 'schedule') && (
            <button className="secondary-btn notif-action-btn" type="button" onClick={() => handleAction('jadwal')}
              id="btn-notif-jadwal">
              📅 Lihat Jadwal
            </button>
          )}
          {item.type === 'watering' && (
            <button className="secondary-btn notif-action-btn" type="button" onClick={() => handleAction('riwayat')}
              id="btn-notif-riwayat">
              📋 Lihat Riwayat
            </button>
          )}
          {(item.type === 'system' || item.type === 'skip') && (
            <button className="secondary-btn notif-action-btn" type="button" onClick={() => handleAction('settings')}
              id="btn-notif-perangkat">
              ⚙ Lihat Perangkat
            </button>
          )}
          {item.type === 'normal' && (
            <button className="secondary-btn notif-action-btn" type="button" onClick={() => handleAction('zona')}
              id="btn-notif-zona">
              🌱 Lihat Zona
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
