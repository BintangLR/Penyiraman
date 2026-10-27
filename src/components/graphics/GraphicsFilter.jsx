import React from 'react';
import { PERIOD_OPTIONS, DATA_TYPE_OPTIONS, ZONE_OPTIONS } from '../../data/graphData';
import { Activity } from 'lucide-react';

/**
 * Panel filter grafik (kanan atas area grafik utama)
 */
export function GraphicsFilter({ filters, onChange, onApply }) {
  return (
    <div className="gfilter-panel">
      <div className="gfilter-title">Filter Grafik</div>

      <div className="gfilter-field">
        <label className="gfilter-label">Periode</label>
        <select
          id="gf-period"
          value={filters.period}
          onChange={e => onChange('period', e.target.value)}
          className="gfilter-select"
        >
          {PERIOD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="gfilter-field">
        <label className="gfilter-label">Tipe Data</label>
        <select
          id="gf-datatype"
          value={filters.dataType}
          onChange={e => onChange('dataType', e.target.value)}
          className="gfilter-select"
        >
          {DATA_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="gfilter-field">
        <label className="gfilter-label">Zona</label>
        <select
          id="gf-zone"
          value={filters.zone}
          onChange={e => onChange('zone', e.target.value)}
          className="gfilter-select"
        >
          {ZONE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <button
        id="btn-tampilkan-grafik"
        className="primary-btn"
        style={{ width: '100%', marginTop: 4, padding: '10px 14px', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        onClick={onApply}
      >
        <Activity size={14} strokeWidth={1.8} /> Tampilkan Grafik
      </button>
    </div>
  );
}
