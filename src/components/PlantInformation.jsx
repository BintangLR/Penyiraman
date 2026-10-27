import React from 'react';

/**
 * Card informasi tanaman.
 * Data dapat diubah lewat EditZoneModal.
 */
export function PlantInformation({ zone, onEdit }) {
  const items = [
    { label: 'Jenis Tanaman', value: zone.plant },
    { label: 'Kebutuhan Air', value: zone.waterNeed },
    { label: 'Target Kelembapan', value: `${zone.targetMoistureMin}% – ${zone.targetMoistureMax}%` },
    { label: 'Tipe Tanah', value: zone.soilType },
    { label: 'Luas Area', value: zone.area },
  ];

  return (
    <div className="detail-card">
      <div className="detail-card-header">
        <div>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 750, letterSpacing: '-.02em' }}>
            Informasi Tanaman
          </h3>
          <p style={{ margin: '3px 0 0', fontSize: 10, color: '#779185' }}>
            {zone.name} — {zone.plant}
          </p>
        </div>
        <button
          id={`btn-edit-plant-${zone.id}`}
          className="text-button"
          onClick={onEdit}
          style={{ fontSize: 11, padding: '6px 12px', border: '1px solid #e2ece6', borderRadius: 8, background: '#fbfdfc' }}
        >
          Edit
        </button>
      </div>

      <div className="plant-info-grid">
        {items.map(item => (
          <div key={item.label} className="plant-info-item">
            <div className="plant-info-label">{item.label}</div>
            <div className="plant-info-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
