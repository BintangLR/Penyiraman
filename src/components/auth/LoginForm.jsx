import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../auth/PasswordInput';
import { ArrowRight } from 'lucide-react';
import loginCover from '../../../assets/cover login/gambar 1.jpeg';
import { AuthMarketingPanel, AUTH_PAGE_BACKGROUND } from './AuthMarketingPanel';

const LOGIN_SLIDES = [
  {
    title: 'Pertanian Lebih Cerdas untuk Toraja',
    description: 'Sistem irigasi pintar untuk mendukung pertanian yang lebih produktif, efisien, dan berkelanjutan di Tanah Toraja.',
    features: [
      { title: 'Monitoring Real-time', description: 'Pantau data lahan secara langsung.' },
      { title: 'Pantau Kondisi Lahan dengan Mudah', description: 'Cek kondisi setiap zona dengan praktis.' },
      { title: 'Kelola Irigasi Lebih Efisien', description: 'Dukung produktivitas pertanian Toraja.' },
    ],
  },
  {
    title: 'Mari Wujudkan Pertanian Berkelanjutan',
    description: 'Dukung pengelolaan air yang lebih efisien dan pertanian yang tangguh menghadapi perubahan kondisi lingkungan.',
    features: [
      { title: 'Efisiensi Air', description: 'Gunakan air sesuai kebutuhan tanaman.' },
      { title: 'Informasi Aktual', description: 'Pantau kondisi kelembapan tanah.' },
      { title: 'Pertanian Berkelanjutan', description: 'Dukung produktivitas lahan dalam jangka panjang.' },
    ],
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
    <div className="auth-page" style={{ backgroundImage: `url(${AUTH_PAGE_BACKGROUND})` }}>
    <div className="auth-shell">
      <AuthMarketingPanel
        cover={loginCover}
        slides={LOGIN_SLIDES}
        imageAlt="Pemandangan pertanian Toraja"
        mobileTitle="Welcome back!"
        mobileDescription="Masuk untuk mengakses sistem irigasi cerdas Lahan Toraja."
      />

      {/* Right: form */}
      <div className="auth-right">
        <div className="auth-card">
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
              {loading ? <span className="auth-spinner" /> : (
                <>
                  <span className="auth-submit-label-desktop">Masuk ke Dashboard</span>
                  <span className="auth-submit-label-mobile">Login</span>
                  <ArrowRight className="auth-button-arrow" size={18} aria-hidden="true" />
                </>
              )}
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
    </div>
  );
}
