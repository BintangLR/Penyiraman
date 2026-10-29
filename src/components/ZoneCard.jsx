import React from 'react';
import { ZoneStatusBadge, MoistureBar } from './ZoneStatusBadge';
import { Sprout, Cpu, Clock, ArrowRight } from 'lucide-react';
import { getPlantImage, getPlantImageFallback } from '../data/plantImages';

/**
 * Card zona lahan — tampil di halaman grid Zona Lahan.
 */
export function ZoneCard({ zone, onClick }) {
  const [imgError, setImgError] = React.useState(false);
  const preferredImage = getPlantImage(zone);
  const fallbackImage = getPlantImageFallback(zone)
    || (zone.image && zone.image !== preferredImage ? zone.image : '');
  const [imageSrc, setImageSrc] = React.useState(preferredImage);

  React.useEffect(() => {
    setImageSrc(preferredImage);
    setImgError(false);
  }, [preferredImage]);

  function handleImageError() {
    if (fallbackImage && imageSrc !== fallbackImage) {
      setImageSrc(fallbackImage);
      return;
    }
    setImgError(true);
  }

  return (
    <article
      className="zone-card"
      onClick={() => onClick(zone.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(zone.id)}
      aria-label={`Buka detail ${zone.name} — ${zone.plant}`}
    >
      {/* Hero image */}
      <div className="zone-card-img-wrap">
        {!imgError ? (
          <img
            src={imageSrc}
            alt={`Tanaman ${zone.plant}`}
            className="zone-card-img"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="zone-card-img-fallback">
            <Sprout size={36} strokeWidth={1.5} />
          </div>
        )}
        <div className="zone-card-badge-row">
          <span className="zone-badge-label">{zone.name}</span>
          <ZoneStatusBadge status={zone.status} />
        </div>
      </div>

      {/* Card body */}
      <div className="zone-card-body">
        {/* Plant + device status */}
        <div className="zone-card-top">
          <div>
            <div className="zone-card-plant">{zone.plant}</div>
            <div className="zone-card-sensors">
              <span className="zone-sensor-count">
                <i className="icon-dot" style={{ background: '#10a67a' }} />
                {zone.sensors.length} sensor
              </span>
              <span style={{
                fontSize: 9, fontWeight: 700,
                color: zone.deviceStatus === 'Online' ? '#11855f' : '#d63f3f',
              }}>
                {zone.deviceStatus}
              </span>
            </div>
          </div>
          <div className="zone-card-moisture-big">
            <span style={{ color: getMoistureColor(zone.status) }}>
              {zone.moisture}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <MoistureBar value={zone.moisture} status={zone.status} height={5} />

        {/* Footer */}
        <div className="zone-card-footer">
          <span className="zone-card-updated">
            <Clock size={10} strokeWidth={1.8} />
            {zone.lastUpdated}
          </span>
          <span className="zone-card-arrow" aria-hidden="true">
            <ArrowRight size={14} strokeWidth={2} />
          </span>
        </div>
      </div>
    </article>
  );
}

function getMoistureColor(status) {
  if (status === 'Kering') return '#e55353';
  if (status === 'Basah')  return '#2878d6';
  return '#10a67a';
}
