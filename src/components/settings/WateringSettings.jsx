import React from 'react';
import { Check, Droplets, Gauge, Save, Sprout, Timer } from 'lucide-react';

const DURATION_OPTIONS = ['5 menit', '8 menit', '10 menit', '15 menit', '20 menit', '30 menit'];
const FLOW_OPTIONS = ['0.8 Liter/menit', '1.0 Liter/menit', '1.2 Liter/menit', '1.5 Liter/menit', '2.0 Liter/menit'];

export function WateringSettings({ settings, onChange, onSave, saved }) {
  return (
    <div className="set-card">
      <div className="set-card-header">
        <h3 className="set-card-title">Pengaturan Penyiraman</h3>
        <p className="set-card-sub">Atur parameter default penyiraman otomatis.</p>
      </div>
      <div className="set-field-group">
        <label className="set-field-label" htmlFor="set-dur"><Timer size={15} strokeWidth={1.8} /> Durasi Default</label>
        <select id="set-dur" className="set-select" value={settings.defaultDuration} onChange={e => onChange('defaultDuration', e.target.value)}>{DURATION_OPTIONS.map(duration => <option key={duration}>{duration}</option>)}</select>
      </div>
      <div className="set-field-group">
        <label className="set-field-label" htmlFor="set-flow"><Droplets size={15} strokeWidth={1.8} /> Estimasi Debit Air</label>
        <select id="set-flow" className="set-select" value={settings.flowRate} onChange={e => onChange('flowRate', e.target.value)}>{FLOW_OPTIONS.map(flow => <option key={flow}>{flow}</option>)}</select>
      </div>
      <div className="set-field-group">
        <div className="set-slider-label-row"><label className="set-field-label" htmlFor="set-moist-min"><Sprout size={15} strokeWidth={1.8} /> Kelembapan Minimal</label><span className="set-slider-val">{settings.moistureMin}%</span></div>
        <input id="set-moist-min" type="range" min={10} max={60} className="set-slider" value={settings.moistureMin} onChange={e => onChange('moistureMin', Number(e.target.value))} />
        <div className="set-slider-hint">Penyiraman dimulai di bawah ambang ini</div>
      </div>
      <div className="set-field-group">
        <div className="set-slider-label-row"><label className="set-field-label" htmlFor="set-moist-opt"><Gauge size={15} strokeWidth={1.8} /> Kelembapan Optimal</label><span className="set-slider-val">{settings.moistureOptimal}%</span></div>
        <input id="set-moist-opt" type="range" min={40} max={100} className="set-slider set-slider-opt" value={settings.moistureOptimal} onChange={e => onChange('moistureOptimal', Number(e.target.value))} />
        <div className="set-slider-hint">Target kelembapan setelah penyiraman</div>
      </div>
      <button className="set-save-btn" onClick={onSave} type="button" id="btn-save-watering">
        {saved ? <><Check size={16} strokeWidth={2} /> Tersimpan</> : <><Save size={16} strokeWidth={1.8} /> Simpan Perubahan</>}
      </button>
    </div>
  );
}
