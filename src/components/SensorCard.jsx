import React from 'react';
import { SensorStatusBadge } from './ZoneStatusBadge';

/** Card individual sensor */
export function SensorCard({ sensor }) {
  const valueColor = sensor.status === 'Normal'
    ? '#10a67a'
    : sensor.status === 'Bermasalah'
    ? '#c47a00'
    : '#e55353';

  return (
    <div className="sensor-card">
      <div className="sensor-card-header">
        <span className="sensor-card-label">{sensor.label}</span>
        <SensorStatusBadge status={sensor.status} />
      </div>
      <div className="sensor-card-value" style={{ color: valueColor }}>
        {sensor.value}%
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{
          height: 4, background: '#eef2ef', borderRadius: 999, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${sensor.value}%`,
            background: valueColor,
            borderRadius: 999,
            transition: 'width .4s ease',
          }} />
        </div>
      </div>
    </div>
  );
}
