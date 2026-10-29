import React from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

/** Input password dengan toggle show/hide */
export function PasswordInput({ id, value, onChange, placeholder, label, error }) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="auth-field">
      {label && <label className="auth-label" htmlFor={id}>{label}</label>}
      <div className="auth-input-wrap">
        <span className="auth-input-prefix">
          <Lock size={15} strokeWidth={1.8} />
        </span>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className={error ? 'auth-input auth-input-error' : 'auth-input'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || 'Masukkan password'}
          autoComplete="current-password"
        />
        <button
          type="button"
          className="auth-eye-btn"
          onClick={() => setShow(v => !v)}
          aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          {show
            ? <EyeOff size={15} strokeWidth={1.8} />
            : <Eye size={15} strokeWidth={1.8} />
          }
        </button>
      </div>
      {error && <span className="auth-field-error">{error}</span>}
    </div>
  );
}
