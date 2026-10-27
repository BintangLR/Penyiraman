import React from 'react';
import { NOTIF_TYPE_CONFIG } from '../../data/notificationData';

/** Satu baris item notifikasi */
export function NotificationItem({ item, isSelected, onClick }) {
  const cfg = NOTIF_TYPE_CONFIG[item.type] || NOTIF_TYPE_CONFIG.system;

  return (
    <button
      id={`notif-item-${item.id}`}
      className={[
        'notif-item',
        item.read ? 'notif-item-read' : 'notif-item-unread',
        isSelected ? 'notif-item-selected' : '',
      ].join(' ')}
      onClick={() => onClick(item)}
      type="button"
    >
      {/* Icon */}
      <div className="notif-item-icon" style={{ background: cfg.bg }}>
        <span style={{ color: cfg.color, fontSize: 18 }}>{cfg.icon}</span>
      </div>

      {/* Body */}
      <div className="notif-item-body">
        <div className="notif-item-title">{item.title}</div>
        <div className="notif-item-desc">{item.description}</div>
        <div className="notif-item-meta">
          <span>{item.date} {item.time}</span>
          <span
            className={item.read ? 'notif-badge notif-badge-read' : 'notif-badge notif-badge-unread'}
          >
            {item.read ? 'Dibaca' : 'Belum dibaca'}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <span className="notif-item-arrow" aria-hidden="true">›</span>
    </button>
  );
}
