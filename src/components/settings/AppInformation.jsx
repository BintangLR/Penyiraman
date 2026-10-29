import React from 'react';
import mpmLogo from '../../../assets/cover login/logo mpm.webp';

/** Card Informasi Sistem / Aplikasi */
export function AppInformation() {
  return (
    <div className="set-card">
      <div className="set-card-header">
        <h3 className="set-card-title">Informasi Sistem</h3>
        <p className="set-card-sub">Informasi dasar sistem irigasi Lahan Toraja.</p>
      </div>

      {/* Logo + nama */}
      <div className="set-app-info-hero">
        <div className="set-app-logo">
          <img className="set-app-logo-image" src={mpmLogo} alt="Logo MPM" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#17372b', letterSpacing: '-.03em' }}>Irigasi Cerdas</div>
          <div style={{ fontSize: 11, color: '#779185', marginTop: 2 }}>Lahan Toraja</div>
          <div style={{ fontSize: 10, color: '#a0b8ae', marginTop: 2 }}>Versi 1.0.0</div>
        </div>
      </div>

      {/* Status badge */}
      <div className="set-status-badge">
        <span className="set-status-dot" />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#11855f' }}>Sistem Berjalan Normal</div>
          <div style={{ fontSize: 9, color: '#779185', marginTop: 1 }}>Semua perangkat terhubung dan berfungsi baik.</div>
        </div>
      </div>
    </div>
  );
}
