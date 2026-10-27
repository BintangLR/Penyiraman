import React from 'react';

const LANG_OPTIONS   = ['Bahasa Indonesia', 'English'];
const TZ_OPTIONS     = ['WITA (UTC+8)', 'WIB (UTC+7)', 'WIT (UTC+9)'];
const REFRESH_OPTIONS = ['1 menit', '5 menit', '10 menit', '30 menit', 'Manual'];

/** Card Pengaturan Umum: bahasa, timezone, tema, auto-refresh */
export function SystemSettings({ settings, onChange, onSave, saved }) {
  return (
    <div className="set-card">
      <div className="set-card-header">
        <h3 className="set-card-title">Pengaturan Umum</h3>
        <p className="set-card-sub">Atur preferensi dasar aplikasi.</p>
      </div>

      {/* Bahasa */}
      <div className="set-field-group">
        <label className="set-field-label" htmlFor="set-lang">🌐 Bahasa</label>
        <select id="set-lang" className="set-select"
          value={settings.language}
          onChange={e => onChange('language', e.target.value)}>
          {LANG_OPTIONS.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      {/* Zona Waktu */}
      <div className="set-field-group">
        <label className="set-field-label" htmlFor="set-tz">🕐 Zona Waktu</label>
        <select id="set-tz" className="set-select"
          value={settings.timezone}
          onChange={e => onChange('timezone', e.target.value)}>
          {TZ_OPTIONS.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Tema */}
      <div className="set-field-group">
        <div className="set-field-label">☀ Tema Tampilan</div>
        <div className="set-theme-picker">
          {['Terang','Gelap'].map(t => (
            <button key={t} type="button"
              className={settings.theme === t ? 'set-theme-btn active' : 'set-theme-btn'}
              onClick={() => onChange('theme', t)}>
              {t === 'Terang' ? '☀' : '🌙'} {t}
            </button>
          ))}
        </div>
      </div>

      {/* Auto refresh */}
      <div className="set-field-group">
        <label className="set-field-label" htmlFor="set-refresh">🔄 Interval Auto Refresh</label>
        <select id="set-refresh" className="set-select"
          value={settings.autoRefresh}
          onChange={e => onChange('autoRefresh', e.target.value)}>
          {REFRESH_OPTIONS.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      <button className="set-save-btn" onClick={onSave} type="button" id="btn-save-system">
        {saved ? '✓ Tersimpan' : 'Simpan Perubahan'}
      </button>
    </div>
  );
}
