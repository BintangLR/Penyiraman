import React from 'react';
import { ZONES_SUMMARY } from '../../data/graphData';
import { getPlantImage, getPlantImageFallback } from '../../data/plantImages';

const statusStyle = {
  Kering: { color: '#d63f3f', bg: '#fdeeee', bar: '#e55353' },
  Normal: { color: '#11855f', bg: '#e7f7ee', bar: '#10a67a' },
  Basah:  { color: '#1e5db5', bg: '#edf4ff', bar: '#2878d6' },
};

/**
 * Panel statistik zona – list compact dengan thumbnail, progress bar, status badge
 */
export function ZoneStatistics({ data = ZONES_SUMMARY, onSelectZone }) {
  return (
    <div className="zone-stats-list">
      {data.map(zone => {
        const st = statusStyle[zone.status] || statusStyle.Normal;
        return (
          <button
            key={zone.id}
            className="zone-stat-item"
            onClick={() => onSelectZone && onSelectZone(zone.id)}
            title={`Buka detail ${zone.name}`}
          >
            {/* Thumbnail */}
            <div className="zone-stat-thumb">
              <img
                src={getPlantImage(zone)}
                alt={`Tanaman ${zone.plant}`}
                loading="lazy"
                onError={e => {
                  const preferred = getPlantImage(zone);
                  const fallback = getPlantImageFallback(zone)
                    || (zone.image && zone.image !== preferred ? zone.image : '');
                  if (fallback && e.currentTarget.src !== fallback) {
                    e.currentTarget.onerror = () => { e.currentTarget.style.display = 'none'; };
                    e.currentTarget.src = fallback;
                  } else {
                    e.currentTarget.style.display = 'none';
                  }
                }}
              />
            </div>

            {/* Info */}
            <div className="zone-stat-info">
              <div className="zone-stat-name">{zone.name} – {zone.plant}</div>
              <div className="zone-stat-bar-row">
                <div className="zone-stat-bar-bg">
                  <div
                    className="zone-stat-bar-fill"
                    style={{ width: `${zone.moisture}%`, background: st.bar }}
                  />
                </div>
              </div>
            </div>

            {/* Value + badge */}
            <div className="zone-stat-right">
              <span className="zone-stat-val" style={{ color: st.bar }}>{zone.moisture}%</span>
              <span className="zone-stat-badge" style={{ color: st.color, background: st.bg }}>
                {zone.status}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
