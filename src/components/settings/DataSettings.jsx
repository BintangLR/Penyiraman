import React from 'react';

const DATA_MENU = [
  { key:'export', icon:'⬇', label:'Export Data',   sub:'Unduh data dalam format CSV' },
  { key:'import', icon:'⬆', label:'Import Data',   sub:'Import konfigurasi dari file' },
  { key:'reset',  icon:'🔄', label:'Reset Sistem',  sub:'Kembalikan ke pengaturan awal', danger: true },
];

/** Card data dan penyimpanan + card reset */
export function DataSettings({ onAction }) {
  return (
    <>
      {/* Data dan Penyimpanan */}
      <div className="set-card">
        <div className="set-card-header">
          <h3 className="set-card-title">Data dan Penyimpanan</h3>
          <p className="set-card-sub">Kelola data sistem dan cadangan.</p>
        </div>
        <div className="set-menu-list">
          {DATA_MENU.map(item => (
            <button
              key={item.key}
              id={`btn-data-${item.key}`}
              className={item.danger ? 'set-menu-item danger-text' : 'set-menu-item'}
              onClick={() => onAction(item.key)}
              type="button"
            >
              <span className="set-menu-icon">{item.icon}</span>
              <div className="set-menu-body">
                <div className="set-menu-label">{item.label}</div>
                <div className="set-menu-sub">{item.sub}</div>
              </div>
              <span className="set-menu-arrow">›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reset card merah */}
      <div className="set-reset-card">
        <div className="set-reset-icon">⚠</div>
        <div>
          <div style={{ fontWeight: 750, fontSize: 13, color: '#c0392b', marginBottom: 4 }}>
            Reset ke Pengaturan Awal
          </div>
          <div style={{ fontSize: 10, color: '#e07070', lineHeight: 1.5 }}>
            Menghapus semua konfigurasi dan mengembalikan sistem ke kondisi awal.
          </div>
        </div>
        <button
          id="btn-reset-sistem"
          className="set-reset-btn"
          onClick={() => onAction('reset')}
          type="button"
        >
          🔄 Reset Sistem
        </button>
      </div>
    </>
  );
}
