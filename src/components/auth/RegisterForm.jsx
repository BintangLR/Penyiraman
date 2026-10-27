import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../auth/PasswordInput';
import { Sprout, Layout, Settings, Users, ArrowLeft } from 'lucide-react';

const BG = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80';

const FEATURES = [
  { icon: Layout,   title: 'Mudah Digunakan',   sub: 'Antarmuka sederhana dan intuitif' },
  { icon: Settings, title: 'Kelola Semua Zona',  sub: 'Pantau, atur, dan analisis dalam satu aplikasi' },
  { icon: Users,    title: 'Dukungan Penuh',     sub: 'Solusi untuk pertanian yang lebih baik' },
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
    <div className="auth-shell">
      {/* Left */}
      <div className="auth-left" style={{ backgroundImage: `url(${BG})` }}>
        <div className="auth-left-overlay" />
        <div className="auth-left-content">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <Sprout size={22} strokeWidth={2} />
            </div>
            <div>
              <div className="auth-brand-name">Irigasi Cerdas</div>
              <div className="auth-brand-sub">Lahan Toraja</div>
            </div>
          </div>

          <h1 className="auth-headline">Bergabung<br />Bersama Kami</h1>
          <p className="auth-tagline">
            Buat akun baru untuk mulai menggunakan sistem irigasi cerdas
            dan kelola lahan Anda dengan lebih mudah.
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

      {/* Right */}
      <div className="auth-right">
        <div className="auth-card">
          {/* Back button (mobile only) */}
          <button
            type="button"
            className="auth-back-btn"
            onClick={() => setAuthView('login')}
            aria-label="Kembali ke halaman masuk"
          >
            <ArrowLeft size={15} strokeWidth={2} /> Kembali
          </button>

          {/* Mini brand */}
          <div className="auth-card-brand">
            <div className="auth-brand-icon-sm">
              <Sprout size={18} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#17372b' }}>Irigasi Cerdas</div>
              <div style={{ fontSize: 11, color: '#779185' }}>Lahan Toraja</div>
            </div>
          </div>

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
              {loading ? <span className="auth-spinner" /> : 'Buat Akun'}
            </button>
          </form>

          <div className="auth-divider-text">
            Sudah punya akun?{' '}
            <button
              id="btn-go-login"
              type="button"
              className="auth-link auth-link-inline"
              onClick={() => setAuthView('login')}
            >
              Masuk di sini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
