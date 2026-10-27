import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from './UserAvatar';
import { Settings, LogOut, ChevronDown } from 'lucide-react';

/**
 * Dropdown profil di navbar kanan atas.
 */
export function ProfileDropdown({ onLogoutRequest, onGoSettings }) {
  const { currentUser } = useAuth();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!currentUser) return null;

  return (
    <div ref={ref} className="profile-dropdown-wrap">
      {/* Trigger */}
      <button
        id="btn-profile-trigger"
        type="button"
        className="profile"
        style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Menu profil pengguna"
      >
        <UserAvatar name={currentUser.name} size="md" />
        <div className="profile-copy">
          <strong>{currentUser.name}</strong>
          <span>{currentUser.role}</span>
        </div>
        <ChevronDown
          size={14}
          strokeWidth={2}
          color="#95a8a0"
          style={{
            marginLeft: 2,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform .2s',
          }}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="profile-menu" role="menu">
          {/* User info */}
          <div className="profile-menu-header">
            <UserAvatar name={currentUser.name} size="lg" />
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontWeight: 700, fontSize: 13, color: '#17372b',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: 11, color: '#779185' }}>{currentUser.role}</div>
              <div style={{
                fontSize: 10, color: '#a0b8ae', marginTop: 1,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {currentUser.email}
              </div>
            </div>
          </div>

          <div className="profile-menu-divider" />

          <button
            id="btn-profile-settings"
            type="button"
            className="profile-menu-item"
            role="menuitem"
            onClick={() => { setOpen(false); onGoSettings && onGoSettings(); }}
          >
            <Settings size={15} strokeWidth={1.8} color="#779185" />
            Kelola Akun
          </button>

          <button
            id="btn-profile-logout"
            type="button"
            className="profile-menu-item profile-menu-item-danger"
            role="menuitem"
            onClick={() => { setOpen(false); onLogoutRequest && onLogoutRequest(); }}
          >
            <LogOut size={15} strokeWidth={1.8} />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
