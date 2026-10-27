import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../auth/PasswordInput';
import { Sprout, Droplets, TrendingUp, Leaf } from 'lucide-react';

const BG = 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1400&q=80';

const FEATURES = [
  {
    icon: Leaf,
    title: 'Monitoring Real-time',
    sub: 'Pantau kondisi lahan kapan saja dan di mana saja',
  },
  {
    icon: Droplets,
    title: 'Penggunaan Air Efisien',
    sub: 'Penyiraman otomatis sesuai kebutuhan tanaman',
  },
  {
    icon: TrendingUp,
    title: 'Tingkatkan Produktivitas',
    sub: 'Pertanian lebih maju, efisien, dan berkelanjutan',
  },
];

export function LoginForm() {
  const { login, setAuthView } = useAuth();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(false);
  const [loading,  setLoading]  = React.useState(false);
  const [errors,   setErrors]   = React.useState({});
  const [apiError, setApiError] = React.useState('');

  function validate() {
    const e = {};
    if (!username.trim()) e.username = 'Username wajib diisi.';
    if (!password.trim()) e.password = 'Password wajib diisi.';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setApiError('');
    setLoading(true);
    const result = await login(username.trim(), password);
    setLoading(false);
    if (!result.ok) setApiError(result.error);
  }

  return (
    <div className="auth-shell">
      {/* Left panel */}
      <div className="auth-left" style={{ backgroundImage: `url(${BG})` }}>
        <div className="auth-left-overlay" />
        <div className="auth-left-content">
          {/* Brand */}
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <Sprout size={22} strokeWidth={2} />
            </div>
            <div>
              <div className="auth-brand-name">Irigasi Cerdas</div>
              <div className="auth-brand-sub">Lahan Toraja</div>
            </div>
          </div>

          <h1 className="auth-headline">
            Pertanian Lebih<br />Cerdas untuk Toraja
          </h1>
          <p className="auth-tagline">
            Sistem irigasi pintar untuk mendukung pertanian yang lebih produktif,
            efisien, dan berkelanjutan di Tana Toraja.
          </p>

          <div className="auth-features">
            {FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="auth-feature-title">{title}</div>
                  <div className="auth-feature-sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="auth-right">
        <div className="auth-card">
          {/* Mini brand */}
          <div className="auth-card-brand">
            <div className="auth-brand-icon-sm">
              <Sprout size={18} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#17372b' }}>
                Irigasi Cerdas
              </div>
              <div style={{ fontSize: 11, color: '#779185' }}>Lahan Toraja</div>
            </div>
          </div>

          <h2 className="auth-card-title">Selamat Datang</h2>
          <p className="auth-card-sub">
            Masuk untuk mengakses sistem irigasi cerdas Lahan Toraja.
          </p>

          {apiError && <div className="auth-error-box">{apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className="auth-field">
              <label htmlFor="login-username" className="auth-label">Username</label>
              <div className="auth-input-wrap">
                <span className="auth-input-prefix">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="login-username"
                  type="text"
                  className={errors.username ? 'auth-input auth-input-error' : 'auth-input'}
                  placeholder="Masukkan username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
              {errors.username && <span className="auth-field-error">{errors.username}</span>}
            </div>

            {/* Password */}
            <div style={{ marginTop: 12 }}>
              <PasswordInput
                id="login-password"
                value={password}
                onChange={setPassword}
                placeholder="Masukkan password"
                error={errors.password}
                label="Password"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="auth-row-between" style={{ marginTop: 12 }}>
              <label className="auth-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span>Ingat saya</span>
              </label>
              <button type="button" className="auth-link">
                Lupa password?
              </button>
            </div>

            {/* Submit */}
            <button
              id="btn-login-submit"
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
              style={{ marginTop: 20 }}
            >
              {loading ? <span className="auth-spinner" /> : 'Masuk ke Dashboard'}
            </button>
          </form>

          <div className="auth-divider-text">Belum punya akun?</div>
          <button
            id="btn-go-register"
            type="button"
            className="auth-btn-outline"
            onClick={() => setAuthView('register')}
          >
            Daftar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
