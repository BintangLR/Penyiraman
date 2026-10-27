import React from 'react';
import { LogOut, X } from 'lucide-react';

/**
 * Modal konfirmasi logout — clean, tidak menggunakan alert browser.
 */
export function LogoutConfirmModal({ onConfirm, onCancel }) {
  React.useEffect(() => {
    function handler(e) { if (e.key === 'Escape') onCancel(); }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div
      className="logout-modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      <div className="logout-modal-card">
        {/* Icon */}
        <div className="logout-modal-icon">
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: '#fdeeee',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LogOut size={24} color="#e44b4b" strokeWidth={1.8} />
          </div>
        </div>

        <h2 id="logout-modal-title" className="logout-modal-title">
          Keluar dari akun?
        </h2>
        <p className="logout-modal-body">
          Apakah Anda yakin ingin keluar dari aplikasi?
        </p>

        <div className="logout-modal-actions">
          <button
            id="btn-logout-cancel"
            type="button"
            className="secondary-btn"
            style={{ flex: 1, height: 44 }}
            onClick={onCancel}
          >
            Batal
          </button>
          <button
            id="btn-logout-confirm"
            type="button"
            className="logout-modal-confirm-btn"
            style={{ flex: 1 }}
            onClick={onConfirm}
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
