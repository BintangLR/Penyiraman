import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

/** Password input dengan show/hide toggle */
export function PasswordField({ id, value, onChange, label, placeholder }) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="form-field">
      {label && <label className="form-label" htmlFor={id}>{label}</label>}
      <div className="set-input-wrap">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className="set-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || '••••••••••••'}
          autoComplete="current-password"
        />
        <button
          type="button"
          className="set-input-icon"
          onClick={() => setShow(v => !v)}
          aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
          tabIndex={-1}
        >
          {show
            ? <EyeOff size={15} strokeWidth={1.8} />
            : <Eye size={15} strokeWidth={1.8} />
          }
        </button>
      </div>
    </div>
  );
}
