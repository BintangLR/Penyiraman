import React from 'react';
import { SORT_OPTIONS } from '../../data/scheduleData';

const TABS = [
  { key: 'all',      label: 'Semua Jadwal' },
  { key: 'active',   label: 'Jadwal Aktif' },
  { key: 'inactive', label: 'Jadwal Nonaktif' },
];

/** Filter tabs + sort dropdown */
export function ScheduleTabs({ schedules, activeTab, onTabChange, sortBy, onSortChange, onAdd }) {
  const counts = {
    all:      schedules.length,
    active:   schedules.filter(s => s.active).length,
    inactive: schedules.filter(s => !s.active).length,
  };

  return (
    <div className="sched-tabs-row">
      <div className="sched-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            id={`tab-sched-${t.key}`}
            className={activeTab === t.key ? 'sched-tab active' : 'sched-tab'}
            onClick={() => onTabChange(t.key)}
          >
            {t.label}
            <span className="sched-tab-count">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      <div className="sched-controls-row">
        <div className="sched-sort-wrap">
          <span style={{ fontSize: 10, color: '#779185', fontWeight: 700, whiteSpace: 'nowrap' }}>Urutkan</span>
          <select
            id="sched-sort-select"
            className="hist-filter-select"
            style={{ minWidth: 'auto', padding: '6px 10px', fontSize: 10 }}
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <button
          id="btn-tambah-jadwal"
          className="primary-btn sched-add-button"
          onClick={onAdd}
        >
          <span aria-hidden="true">+</span> Tambah Jadwal
        </button>
      </div>
    </div>
  );
}
