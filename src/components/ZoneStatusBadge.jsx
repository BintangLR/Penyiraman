import React from 'react';
import { getMoistureBarColor } from '../data/zonesData';

/** Badge status zona: Kering / Normal / Basah */
export function ZoneStatusBadge({ status, size = 'sm' }) {
  const className = `zone-status-badge ${(status || 'Normal').toLowerCase()}`;
  const fontSize  = size === 'lg' ? 12 : 10;
  const padding   = size === 'lg' ? '5px 11px' : '3px 8px';
  return (
    <span className={className} style={{ fontSize, padding }}>
      <i style={{
        width: 6, height: 6, borderRadius: '50%',
        background: 'currentColor', opacity: .75,
        flexShrink: 0, display: 'inline-block',
      }} />
      {status}
    </span>
  );
}

/** Progress bar kelembapan */
export function MoistureBar({ value, status, height = 6, showLabel = false }) {
  const barColor = getMoistureBarColor(status);
  const pct = Math.min(Math.max(value, 0), 100);
  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 10, color: '#779185' }}>
          <span>Kelembapan</span>
          <span style={{ color: barColor, fontWeight: 700 }}>{value}%</span>
        </div>
      )}
      <div className="moisture-bar-wrap" style={{ height, background: '#eef2ef' }}>
        <div
          className="moisture-bar-fill"
          style={{ height: '100%', width: `${pct}%`, background: barColor }}
        />
      </div>
    </div>
  );
}

/** Badge status sensor */
export function SensorStatusBadge({ status }) {
  const map = {
    Normal:     { bg: '#e7f7ee', color: '#11855f' },
    Bermasalah: { bg: '#fff4e5', color: '#c47a00' },
    Offline:    { bg: '#fdeeee', color: '#d63f3f' },
  };
  const c = map[status] || map.Normal;
  return (
    <span style={{
      background: c.bg, color: c.color,
      fontSize: 9, fontWeight: 700,
      padding: '2px 8px', borderRadius: 999,
    }}>
      {status}
    </span>
  );
}

/** Badge koneksi device */
export function DeviceBadge({ status }) {
  const online = status === 'Online';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 9, fontWeight: 700,
      color: online ? '#11855f' : '#d63f3f',
    }}>
      <i style={{
        width: 6, height: 6, borderRadius: '50%',
        background: online ? '#10a67a' : '#e55353',
        display: 'inline-block',
        boxShadow: online ? '0 0 0 2px rgba(16,166,122,.2)' : 'none',
      }} />
      {online ? 'ESP32 Online' : 'ESP32 Offline'}
    </span>
  );
}
