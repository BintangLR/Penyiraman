import React from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { DateRangePicker } from '../graphics/DateRangePicker';

/** Panel filter riwayat: tanggal, zona, tanaman, status */
export function HistoryFilter({ filters, onChange, onApply, onReset, zones, plants, statuses }) {
  return (
    <div className="hist-filter-bar">
      {/* Periode */}
      <div className="hist-filter-field hist-date-filter-field">
        <label className="hist-filter-label" htmlFor="hist-date-range">Periode Tanggal</label>
        <div className="hist-date-input">
          <DateRangePicker
            key={`${filters.startDate.getTime()}-${filters.endDate.getTime()}`}
            buttonId="hist-date-range"
            startDate={filters.startDate}
            endDate={filters.endDate}
            onApply={(startDate, endDate) => {
              onChange('startDate', startDate);
              onChange('endDate', endDate);
            }}
          />
        </div>
      </div>

      {/* Zona */}
      <div className="hist-filter-field">
        <label className="hist-filter-label">Zona</label>
        <select
          id="hist-filter-zone"
          className="hist-filter-select"
          value={filters.zoneId}
          onChange={e => onChange('zoneId', e.target.value)}
        >
          <option value="all">Semua Zona</option>
          {zones.map(zone => <option key={zone.id} value={String(zone.id)}>{zone.label}</option>)}
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
          <option value="all">Semua Tanaman</option>
          {plants.map(plant => <option key={plant} value={plant}>{plant}</option>)}
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
          <option value="all">Semua Status</option>
          {statuses.map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      {/* Tombol aksi */}
      <div className="hist-filter-actions">
        <button
          id="btn-hist-apply"
          className="primary-btn"
          style={{ width: 'auto', padding: '9px 16px', fontSize: 11, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 7 }}
          onClick={onApply}
        >
          <Search size={18} strokeWidth={1.8} /> Tampilkan Data
        </button>
        <button
          id="btn-hist-reset"
          className="secondary-btn"
          onClick={onReset}
          style={{ padding: '9px 14px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 7 }}
        >
          <RotateCcw size={18} strokeWidth={1.8} /> Reset
        </button>
      </div>
    </div>
  );
}
