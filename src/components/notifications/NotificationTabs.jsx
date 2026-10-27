import React from 'react';
import { NOTIF_TABS, SORT_OPTIONS, STATUS_OPTIONS } from '../../data/notificationData';

/** Filter tabs + sort + status dropdowns */
export function NotificationTabs({ items, activeTab, onTabChange, sortBy, onSortChange, statusFilter, onStatusChange }) {
  function count(tabKey) {
    if (tabKey === 'all') return items.length;
    return items.filter(n => n.category === tabKey).length;
  }

  return (
    <div className="notif-tabs-wrap">
      <div className="notif-tabs">
        {NOTIF_TABS.map(t => (
          <button
            key={t.key}
            id={`notif-tab-${t.key}`}
            className={activeTab === t.key ? 'notif-tab active' : 'notif-tab'}
            onClick={() => onTabChange(t.key)}
          >
            {t.label}
            <span className="notif-tab-count">{count(t.key)}</span>
          </button>
        ))}
      </div>

      <div className="notif-filter-right">
        <div className="notif-filter-pair">
          <span className="notif-filter-lbl">Urutkan</span>
          <select
            id="notif-sort"
            className="hist-filter-select"
            style={{ minWidth: 'auto', padding: '6px 10px', fontSize: 10 }}
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="notif-filter-pair">
          <span className="notif-filter-lbl">Status</span>
          <select
            id="notif-status"
            className="hist-filter-select"
            style={{ minWidth: 'auto', padding: '6px 10px', fontSize: 10 }}
            value={statusFilter}
            onChange={e => onStatusChange(e.target.value)}
          >
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
