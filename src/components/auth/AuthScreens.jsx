import React from 'react';
import { Sprout, CheckCircle } from 'lucide-react';
import mpmLogo from '../../../assets/cover login/logo mpm.webp';

/**
 * Loading screen setelah register — progress bar animasi.
 */
export function LoadingScreen() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(id); return 90; }
        return p + Math.random() * 18;
      });
    }, 220);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="auth-loading-screen">
      <div className="auth-loading-card">
        <div className="auth-loading-logo">
          <img className="auth-screen-logo" src={mpmLogo} alt="Logo MPM" />
        </div>

        <div className="auth-loading-icon-wrap">
          <div className="auth-loading-ring" />
          <div className="auth-loading-plant">
            <Sprout size={32} strokeWidth={1.8} />
          </div>
        </div>

        <h2 className="auth-loading-title">Akun berhasil dibuat!</h2>
        <p className="auth-loading-sub">Sedang menyiapkan dashboard...</p>

        <div className="auth-progress-bg">
          <div
            className="auth-progress-fill"
            style={{ width: `${Math.min(progress, 90)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Success screen — ditampilkan setelah loading selesai.
 */
export function SuccessScreen({ onEnter }) {
  React.useEffect(() => {
    const id = setTimeout(() => onEnter(), 3000);
    return () => clearTimeout(id);
  }, [onEnter]);

  return (
    <div className="auth-success-screen">
      <div className="auth-success-card">
        {/* Confetti decorations */}
        {[0, 1, 2, 3, 4].map(i => (
          <span
            key={i}
            className="auth-confetti"
            aria-hidden="true"
            style={{ fontSize: 12 }}
          >
            {['✦', '✧', '✦', '✧', '✦'][i]}
          </span>
        ))}

        <div className="auth-success-check-wrap">
          <CheckCircle size={40} strokeWidth={2} />
        </div>

        <h2 className="auth-success-title">Selamat Datang!</h2>
        <p className="auth-success-sub">
          Akun berhasil dibuat.<br />Anda akan diarahkan ke dashboard.
        </p>

        <button
          id="btn-enter-dashboard"
          type="button"
          className="auth-btn-primary"
          onClick={onEnter}
          style={{ maxWidth: 260, margin: '0 auto' }}
        >
          Lanjut ke Dashboard
        </button>
      </div>
    </div>
  );
}
