import React from 'react';
import { ChevronRight } from 'lucide-react';
import { getNotificationConfig } from '../../data/notificationData';

/** Satu baris item notifikasi */
export function NotificationItem({ item, isSelected, onClick }) {
  const cfg = getNotificationConfig(item);
  const Icon = cfg.icon;

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
        <Icon size={20} strokeWidth={1.8} color={cfg.color} aria-hidden="true" />
      </div>

      {/* Body */}
      <div className="notif-item-body">
        <div className="notif-item-title">{item.title || 'Notifikasi'}</div>
        <div className="notif-item-desc">{item.description || 'Informasi sistem irigasi'}</div>
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
      <ChevronRight className="notif-item-arrow" size={18} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
