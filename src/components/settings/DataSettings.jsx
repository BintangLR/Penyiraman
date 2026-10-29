import React from 'react';
import { ChevronRight, Download, RefreshCw, Upload } from 'lucide-react';

const DATA_MENU = [
  { key: 'export', icon: Download, label: 'Export Data', sub: 'Unduh data dalam format CSV' },
  { key: 'import', icon: Upload, label: 'Import Data', sub: 'Import konfigurasi dari file' },
  { key: 'reset', icon: RefreshCw, label: 'Reset Sistem', sub: 'Kembalikan ke pengaturan awal', danger: true },
];

export function DataSettings({ onAction }) {
  return (
    <div className="set-card">
      <div className="set-card-header">
        <h3 className="set-card-title">Data dan Penyimpanan</h3>
        <p className="set-card-sub">Kelola data sistem dan cadangan.</p>
      </div>
      <div className="set-menu-list">
        {DATA_MENU.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.key} id={`btn-data-${item.key}`} className={item.danger ? 'set-menu-item danger-text' : 'set-menu-item'} onClick={() => onAction(item.key)} type="button">
              <span className="set-menu-icon"><Icon size={16} strokeWidth={1.8} /></span>
              <div className="set-menu-body"><div className="set-menu-label">{item.label}</div><div className="set-menu-sub">{item.sub}</div></div>
              <ChevronRight className="set-menu-arrow" size={16} strokeWidth={1.8} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
