import React from 'react';

/**
 * Modal form untuk mengedit data zona.
 * Jenis tanaman tidak di-hardcode — menggunakan daftar pilihan
 * yang dapat disimpan ke database melalui halaman detail zona.
 */

// Daftar tanaman yang tersedia — bisa diganti dari Firebase
const AVAILABLE_PLANTS = [
  'Kopi', 'Cabai', 'Tomat', 'Sawi', 'Selada',
  'Jagung', 'Kubis', 'Wortel', 'Kentang',
  'Terong', 'Bawang Merah', 'Bawang Putih',
  'Padi', 'Singkong', 'Ubi Jalar',
  'Bayam', 'Kangkung', 'Labu', 'Kacang Panjang',
];

export function EditZoneModal({ zone, onSave, onClose }) {
  const [form, setForm] = React.useState({
    name: zone.name,
    plant: zone.plant,
    targetMoistureMin: zone.targetMoistureMin,
    targetMoistureMax: zone.targetMoistureMax,
    moistureMin: zone.moistureMin,
    moistureMax: zone.moistureMax,
    irrigationDuration: zone.irrigationDuration,
    area: zone.area,
    soilType: zone.soilType,
    waterNeed: zone.waterNeed,
    image: zone.image,
  });
  const [saving, setSaving] = React.useState(false);

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({ ...zone, ...form });
    } finally {
      setSaving(false);
    }
  }

  // Trap focus di modal, close saat tekan Esc
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 id="modal-title" style={{ margin: 0, fontSize: 15, fontWeight: 750, letterSpacing: '-.03em' }}>
              Edit Zona
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 11, color: '#779185' }}>
              {zone.name} — {zone.plant}
            </p>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="modal-body">
          <div className="form-section">
            <div className="form-section-title">Identitas Zona</div>
            <div className="form-grid-2">
              <FormField label="Nama Zona" id="edit-zone-name">
                <input
                  id="edit-zone-name"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                />
              </FormField>
              <FormField label="Jenis Tanaman" id="edit-plant">
                <select
                  id="edit-plant"
                  value={form.plant}
                  onChange={e => handleChange('plant', e.target.value)}
                >
                  {AVAILABLE_PLANTS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Pengaturan Kelembapan</div>
            <div className="form-grid-3">
              <FormField label="Kelembapan Min (%)" id="edit-moisture-min">
                <input
                  id="edit-moisture-min"
                  type="number" min={0} max={100}
                  value={form.moistureMin}
                  onChange={e => handleChange('moistureMin', Number(e.target.value))}
                />
              </FormField>
              <FormField label="Target Min (%)" id="edit-target-min">
                <input
                  id="edit-target-min"
                  type="number" min={0} max={100}
                  value={form.targetMoistureMin}
                  onChange={e => handleChange('targetMoistureMin', Number(e.target.value))}
                />
              </FormField>
              <FormField label="Target Max (%)" id="edit-target-max">
                <input
                  id="edit-target-max"
                  type="number" min={0} max={100}
                  value={form.targetMoistureMax}
                  onChange={e => handleChange('targetMoistureMax', Number(e.target.value))}
                />
              </FormField>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Pengaturan Penyiraman & Lahan</div>
            <div className="form-grid-2">
              <FormField label="Durasi Penyiraman (menit)" id="edit-duration">
                <input
                  id="edit-duration"
                  type="number" min={0}
                  value={form.irrigationDuration}
                  onChange={e => handleChange('irrigationDuration', Number(e.target.value))}
                />
              </FormField>
              <FormField label="Kebutuhan Air" id="edit-water-need">
                <select
                  id="edit-water-need"
                  value={form.waterNeed}
                  onChange={e => handleChange('waterNeed', e.target.value)}
                >
                  <option>Rendah</option>
                  <option>Sedang</option>
                  <option>Tinggi</option>
                </select>
              </FormField>
              <FormField label="Luas Area" id="edit-area">
                <input
                  id="edit-area"
                  value={form.area}
                  onChange={e => handleChange('area', e.target.value)}
                />
              </FormField>
              <FormField label="Tipe Tanah" id="edit-soil">
                <select
                  id="edit-soil"
                  value={form.soilType}
                  onChange={e => handleChange('soilType', e.target.value)}
                >
                  <option>Lempung</option>
                  <option>Lempung Berpasir</option>
                  <option>Lempung Berdebu</option>
                  <option>Tanah Humus</option>
                  <option>Tanah Berhumus</option>
                  <option>Pasir</option>
                </select>
              </FormField>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Foto Tanaman/Lahan</div>
            <FormField label="URL Foto" id="edit-image">
              <input
                id="edit-image"
                type="url"
                value={form.image}
                onChange={e => handleChange('image', e.target.value)}
                placeholder="https://..."
              />
            </FormField>
            {form.image && (
              <div style={{ marginTop: 10, borderRadius: 10, overflow: 'hidden', height: 120 }}>
                <img
                  src={form.image}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="secondary-btn" onClick={onClose} style={{ minWidth: 88 }}>
            Batal
          </button>
          <button
            id="btn-save-zone"
            className="primary-btn"
            style={{ minWidth: 120, padding: '10px 20px' }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Menyimpan...' : '✓ Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, id, children }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">{label}</label>
      {children}
    </div>
  );
}
