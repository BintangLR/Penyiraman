import React from 'react';
import { Droplets } from 'lucide-react';
import { ALL_DAYS, ALL_ZONES } from '../../data/scheduleData';

const FLOW_RATE = 1.2;

const DEFAULT_FORM = {
  zoneId: 1, time: '06:00', duration: 10,
  days: [...ALL_DAYS], active: true, mode: 'Otomatis',
};

/**
 * Modal form tambah/edit jadwal.
 * estimatedWater dihitung otomatis dari duration × flowRate.
 */
export function ScheduleForm({ open, initial, onSave, onClose }) {
  const [form, setForm] = React.useState(DEFAULT_FORM);

  // Populate form when opening for edit
  React.useEffect(() => {
    if (open) {
      setForm(initial
        ? { zoneId: initial.zoneId, time: initial.time, duration: initial.duration, days: [...initial.days], active: initial.active, mode: initial.mode }
        : DEFAULT_FORM
      );
    }
  }, [open, initial]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const h = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const zoneInfo = ALL_ZONES.find(z => z.value === Number(form.zoneId)) || ALL_ZONES[0];
  const estimated = Math.round(form.duration * FLOW_RATE);

  function handleDayToggle(day) {
    setForm(f => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter(d => d !== day) : [...f.days, day],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      zoneId: Number(form.zoneId),
      zoneName: zoneInfo.label.split(' – ')[0],
      plant: zoneInfo.plant,
      plantType: zoneInfo.plantType,
      image: zoneInfo.image,
      time: form.time,
      duration: Number(form.duration),
      flowRate: FLOW_RATE,
      estimatedWater: estimated,
      days: ALL_DAYS.filter(d => form.days.includes(d)),
      active: form.active,
      mode: form.mode,
    });
  }

  const isEditing = !!initial;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 520 }} role="dialog" aria-modal="true" aria-labelledby="sched-form-title">
        {/* Header */}
        <div className="modal-header">
          <h2 id="sched-form-title" style={{ margin: 0, fontSize: 15, fontWeight: 750 }}>
            {isEditing ? 'Edit Jadwal Penyiraman' : 'Tambah Jadwal Penyiraman'}
          </h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ gap: 16 }}>

            {/* Zona */}
            <div className="form-field">
              <label className="form-label" htmlFor="sf-zone">Zona</label>
              <select
                id="sf-zone"
                className="hist-filter-select"
                style={{ width: '100%' }}
                value={form.zoneId}
                onChange={e => setForm(f => ({ ...f, zoneId: Number(e.target.value) }))}
              >
                {ALL_ZONES.map(z => <option key={z.value} value={z.value}>{z.label}</option>)}
              </select>
            </div>

            {/* Waktu */}
            <div className="sched-form-row">
              <div className="form-field" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="sf-time">Waktu</label>
                <input
                  id="sf-time"
                  type="time"
                  className="hist-filter-select"
                  style={{ width: '100%' }}
                  value={form.time}
                  onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                  required
                />
              </div>

              {/* Durasi */}
              <div className="form-field" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="sf-duration">Durasi Penyiraman</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    id="sf-duration"
                    type="number"
                    min={1} max={120}
                    className="hist-filter-select"
                    style={{ width: '100%', paddingRight: 44 }}
                    value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))}
                    required
                  />
                  <span style={{ position: 'absolute', right: 12, fontSize: 10, color: '#779185' }}>menit</span>
                </div>
              </div>
            </div>

            {/* Estimasi air (read-only) */}
            <div className="sched-form-est-box">
              <span className="sched-form-est-label"><Droplets size={20} strokeWidth={1.8} aria-hidden="true" /> Estimasi Air Digunakan</span>
              <strong>± {estimated} Liter</strong>
              <span style={{ fontSize: 9, color: '#a0b8ae' }}>({form.duration} menit × {FLOW_RATE} L/mnt)</span>
            </div>

            {/* Hari penyiraman */}
            <div className="form-field">
              <label className="form-label">Hari Penyiraman</label>
              <div className="sched-days-picker">
                {ALL_DAYS.map(d => (
                  <button
                    key={d}
                    type="button"
                    className={form.days.includes(d) ? 'sched-day-pick active' : 'sched-day-pick'}
                    onClick={() => handleDayToggle(d)}
                    aria-pressed={form.days.includes(d)}
                  >
                    {d}
                  </button>
                ))}
                <button
                  type="button"
                  className="sched-day-pick-all"
                  onClick={() => setForm(f => ({ ...f, days: f.days.length === ALL_DAYS.length ? [] : [...ALL_DAYS] }))}
                >
                  {form.days.length === ALL_DAYS.length ? 'Hapus semua' : 'Pilih semua'}
                </button>
              </div>
            </div>

            {/* Status + Mode */}
            <div className="sched-form-row">
              <div className="form-field" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="sf-status">Status</label>
                <select
                  id="sf-status"
                  className="hist-filter-select"
                  style={{ width: '100%' }}
                  value={form.active ? 'aktif' : 'nonaktif'}
                  onChange={e => setForm(f => ({ ...f, active: e.target.value === 'aktif' }))}
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>
              <div className="form-field" style={{ flex: 1 }}>
                <label className="form-label">Mode</label>
                <div style={{ display: 'flex', gap: 16, paddingTop: 6 }}>
                  {['Otomatis','Manual'].map(m => (
                    <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', fontWeight: form.mode === m ? 700 : 400 }}>
                      <input
                        type="radio"
                        name="sf-mode"
                        value={m}
                        checked={form.mode === m}
                        onChange={() => setForm(f => ({ ...f, mode: m }))}
                        style={{ accentColor: 'var(--green-700)' }}
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="secondary-btn" onClick={onClose} style={{ minWidth: 80 }}>Batal</button>
            <button
              type="submit"
              className="primary-btn"
              style={{ width: 'auto', padding: '9px 20px', fontSize: 12 }}
              disabled={form.days.length === 0}
            >
              {isEditing ? 'Simpan Perubahan' : 'Simpan Jadwal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
