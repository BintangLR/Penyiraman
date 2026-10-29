import React from 'react';
import { Check, Clock, Languages, Moon, RefreshCw, Save, Sun } from 'lucide-react';

const LANG_OPTIONS = ['Bahasa Indonesia', 'English'];
const TZ_OPTIONS = ['WITA (UTC+8)', 'WIB (UTC+7)', 'WIT (UTC+9)'];
const REFRESH_OPTIONS = ['1 menit', '5 menit', '10 menit', '30 menit', 'Manual'];

export function SystemSettings({ settings, onChange, onSave, saved }) {
  const english = settings.language === 'English';
  return (
    <div className="set-card">
      <div className="set-card-header">
        <h3 className="set-card-title">{english ? 'General Settings' : 'Pengaturan Umum'}</h3>
        <p className="set-card-sub">{english ? 'Configure basic application preferences.' : 'Atur preferensi dasar aplikasi.'}</p>
      </div>
      <div className="set-field-group">
        <label className="set-field-label" htmlFor="set-lang"><Languages size={15} strokeWidth={1.8} /> {english ? 'Language' : 'Bahasa'}</label>
        <select id="set-lang" className="set-select" value={settings.language} onChange={e => onChange('language', e.target.value)}>{LANG_OPTIONS.map(language => <option key={language}>{language}</option>)}</select>
      </div>
      <div className="set-field-group">
        <label className="set-field-label" htmlFor="set-tz"><Clock size={15} strokeWidth={1.8} /> {english ? 'Time zone' : 'Zona Waktu'}</label>
        <select id="set-tz" className="set-select" value={settings.timezone} onChange={e => onChange('timezone', e.target.value)}>{TZ_OPTIONS.map(timezone => <option key={timezone}>{timezone}</option>)}</select>
      </div>
      <div className="set-field-group">
        <div className="set-field-label"><Sun size={15} strokeWidth={1.8} /> {english ? 'Appearance' : 'Tema Tampilan'}</div>
        <div className="set-theme-picker">
          {['Terang', 'Gelap'].map(theme => <button key={theme} type="button" className={settings.theme === theme ? 'set-theme-btn active' : 'set-theme-btn'} onClick={() => onChange('theme', theme)}>{theme === 'Terang' ? <Sun size={15} strokeWidth={1.8} /> : <Moon size={15} strokeWidth={1.8} />} {english ? (theme === 'Terang' ? 'Light' : 'Dark') : theme}</button>)}
        </div>
      </div>
      <div className="set-field-group">
        <label className="set-field-label" htmlFor="set-refresh"><RefreshCw size={15} strokeWidth={1.8} /> {english ? 'Auto-refresh interval' : 'Interval Auto Refresh'}</label>
        <select id="set-refresh" className="set-select" value={settings.autoRefresh} onChange={e => onChange('autoRefresh', e.target.value)}>{REFRESH_OPTIONS.map(refresh => <option key={refresh}>{refresh}</option>)}</select>
      </div>
      <button className="set-save-btn" onClick={onSave} type="button" id="btn-save-system">
        {saved ? <><Check size={16} strokeWidth={2} /> {english ? 'Saved' : 'Tersimpan'}</> : <><Save size={16} strokeWidth={1.8} /> {english ? 'Save Changes' : 'Simpan Perubahan'}</>}
      </button>
    </div>
  );
}
