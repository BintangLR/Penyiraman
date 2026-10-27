import React from 'react';

/**
 * Toggle switch ON/OFF – aksesibel dan animasi smooth
 */
export function ToggleSwitch({ checked, onChange, id, label }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label || (checked ? 'Aktif' : 'Nonaktif')}
      className={`toggle-switch ${checked ? 'on' : 'off'}`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span className="toggle-knob" />
      <span className="toggle-label">{checked ? 'ON' : 'OFF'}</span>
    </button>
  );
}
