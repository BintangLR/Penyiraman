import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../auth/PasswordInput';
import { ArrowRight } from 'lucide-react';
import registerCover from '../../../assets/cover login/gambar 1.jpeg';
import { AuthMarketingPanel, AUTH_PAGE_BACKGROUND } from './AuthMarketingPanel';

const REGISTER_SLIDES = [
  {
    title: 'Bergabung Bersama Kami',
    description: 'Buat akun untuk mulai menggunakan sistem irigasi cerdas dan mengelola lahan dengan lebih mudah di Tanah Toraja.',
    features: [
      { title: 'Mudah Digunakan', description: 'Antarmuka sederhana dan intuitif.' },
      { title: 'Kelola Zona', description: 'Pantau kondisi setiap zona lahan.' },
      { title: 'Monitoring Terpadu', description: 'Akses informasi kelembapan dalam satu aplikasi.' },
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

export function RegisterForm() {
  const { register, setAuthView } = useAuth();

  const [form,    setFormState] = React.useState({ username: '', email: '', password: '', confirm: '' });
  const [errors,  setErrors]   = React.useState({});
  const [loading, setLoading]  = React.useState(false);

  function setField(key, val) { setFormState(f => ({ ...f, [key]: val })); }

  function validate() {
    const e = {};
    if (!form.username.trim())  e.username = 'Username wajib diisi.';
    if (!form.password.trim())  e.password = 'Password wajib diisi.';
    else if (form.password.length < 6) e.password = 'Password minimal 6 karakter.';
    if (!form.confirm.trim())   e.confirm = 'Konfirmasi password wajib diisi.';
    else if (form.confirm !== form.password) e.confirm = 'Konfirmasi password tidak sama.';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    const result = await register(form.username.trim(), form.email.trim(), form.password);
    setLoading(false);
    if (!result?.ok) setErrors({ username: result?.error || 'Registrasi gagal.' });
  }

  return (
    <div className="auth-page" style={{ backgroundImage: `url(${AUTH_PAGE_BACKGROUND})` }}>
    <div className="auth-shell">
      <AuthMarketingPanel
        cover={registerCover}
        slides={REGISTER_SLIDES}
        imageAlt="Pemandangan pertanian Toraja"
        mobileTitle="Join us today!"
        mobileDescription="Buat akun untuk mulai menggunakan sistem irigasi cerdas Lahan Toraja."
      />

      {/* Right */}
      <div className="auth-right">
      <div className="auth-card">
        <h2 className="auth-card-title">Buat Akun Baru</h2>
          <p className="auth-card-sub">Lengkapi data berikut untuk mendaftar.</p>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Username */}
            <div className="auth-field">
              <label htmlFor="reg-username" className="auth-label">Username</label>
              <div className="auth-input-wrap">
                <span className="auth-input-prefix">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  id="reg-username"
                  type="text"
                  className={errors.username ? 'auth-input auth-input-error' : 'auth-input'}
                  placeholder="Masukkan username"
                  value={form.username}
                  onChange={e => setField('username', e.target.value)}
                  autoComplete="username"
                />
              </div>
              {errors.username && <span className="auth-field-error">{errors.username}</span>}
            </div>

            {/* Email */}
            <div className="auth-field">
              <label htmlFor="reg-email" className="auth-label">Email <span style={{ color: '#a0b8ae', fontWeight: 400 }}>(opsional)</span></label>
              <div className="auth-input-wrap">
                <span className="auth-input-prefix">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  id="reg-email"
                  type="email"
                  className="auth-input"
                  placeholder="Masukkan email"
                  value={form.email}
                  onChange={e => setField('email', e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <PasswordInput
              id="reg-password"
              value={form.password}
              onChange={v => setField('password', v)}
              placeholder="Masukkan password (min. 6 karakter)"
              error={errors.password}
              label="Password"
            />

            {/* Confirm */}
            <PasswordInput
              id="reg-confirm"
              value={form.confirm}
              onChange={v => setField('confirm', v)}
              placeholder="Ulangi password"
              error={errors.confirm}
              label="Konfirmasi Password"
            />

            <button
              id="btn-register-submit"
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
              style={{ marginTop: 4 }}
            >
              {loading ? <span className="auth-spinner" /> : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="auth-button-arrow" size={18} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider-text">
            Sudah punya akun?{' '}
            <button
              id="btn-go-login"
              type="button"
              className="auth-link auth-link-inline auth-register-login-link"
              onClick={() => setAuthView('login')}
            >
              <span className="auth-register-login-label-desktop">Masuk Sekarang</span>
              <span className="auth-register-login-label-mobile">Login Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
