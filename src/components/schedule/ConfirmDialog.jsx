import React from 'react';
import { Trash2, X } from 'lucide-react';

/** Dialog konfirmasi hapus jadwal */
export function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal-box" style={{ maxWidth: 380 }} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="modal-header" style={{ borderBottom: 0, paddingBottom: 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#fdeeee', color: '#e44b4b',
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Trash2 size={20} strokeWidth={1.8} />
          </div>
          <button className="modal-close-btn" onClick={onCancel} aria-label="Tutup">
            <X size={15} strokeWidth={2} />
          </button>
        </div>
        <div className="modal-body" style={{ paddingTop: 12, gap: 6 }}>
          <h2 id="confirm-title" style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
            {title || 'Hapus jadwal ini?'}
          </h2>
          <p style={{ margin: 0, fontSize: 12, color: '#779185', lineHeight: 1.6 }}>
            {message || 'Jadwal yang dihapus tidak dapat dikembalikan. Lanjutkan?'}
          </p>
        </div>
        <div className="modal-footer">
          <button className="secondary-btn" onClick={onCancel} style={{ minWidth: 80 }}>
            Batal
          </button>
          <button
            className="primary-btn stop"
            style={{ width: 'auto', padding: '0 20px', minWidth: 80 }}
            onClick={onConfirm}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
