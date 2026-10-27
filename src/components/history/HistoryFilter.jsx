import React from 'react';
import { Calendar, Search } from 'lucide-react';
import { ZONE_OPTIONS, PLANT_OPTIONS, STATUS_OPTIONS } from '../../data/historyData';

/** Panel filter riwayat: tanggal, zona, tanaman, status */
export function HistoryFilter({ filters, onChange, onApply, onReset }) {
  return (
    <div className="hist-filter-bar">
      {/* Periode */}
      <div className="hist-filter-field">
        <label className="hist-filter-label">Periode Tanggal</label>
        <div className="hist-date-input">
          <span style={{ color: '#779185' }}><Calendar size={14} strokeWidth={1.8} /></span>
          <input
            id="hist-date-range"
            type="text"
            value={filters.dateRange}
            onChange={e => onChange('dateRange', e.target.value)}
            placeholder="14 Sep 2025 – 20 Sep 2025"
            readOnly
            style={{ cursor: 'pointer', minWidth: 170 }}
          />
        </div>
      </div>

      {/* Zona */}
      <div className="hist-filter-field">
        <label className="hist-filter-label">Zona</label>
        <select
          id="hist-filter-zone"
          className="hist-filter-select"
          value={filters.zone}
          onChange={e => onChange('zone', e.target.value)}
        >
          {ZONE_OPTIONS.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
      </div>

      {/* Tanaman */}
      <div className="hist-filter-field">
        <label className="hist-filter-label">Jenis Tanaman</label>
        <select
          id="hist-filter-plant"
          className="hist-filter-select"
          value={filters.plant}
          onChange={e => onChange('plant', e.target.value)}
        >
          {PLANT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Status */}
      <div className="hist-filter-field">
        <label className="hist-filter-label">Status</label>
        <select
          id="hist-filter-status"
          className="hist-filter-select"
          value={filters.status}
          onChange={e => onChange('status', e.target.value)}
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Tombol aksi */}
      <div className="hist-filter-actions">
        <button
          id="btn-hist-apply"
          className="primary-btn"
          style={{ width: 'auto', padding: '9px 16px', fontSize: 11, whiteSpace: 'nowrap' }}
          onClick={onApply}
        >
          <Search size={14} strokeWidth={1.8} /> Tampilkan Data
        </button>
        <button
          id="btn-hist-reset"
          className="secondary-btn"
          onClick={onReset}
          style={{ padding: '9px 14px', fontSize: 11 }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
