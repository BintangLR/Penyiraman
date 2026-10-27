import React from 'react';
import { api } from '../services/api';

// ─── Helper ───────────────────────────────────────────────────────
export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Constants ────────────────────────────────────────────────────
const STORAGE_KEY = 'ics_current_user';

const AuthContext = React.createContext(null);

// ─── Provider ─────────────────────────────────────────────────────
export function AuthProvider({ children }) {

  /** Aplikasi selalu dimulai dari login; kredensial diverifikasi oleh API MySQL. */
  const [currentUser, setCurrentUser] = React.useState(null);

  /** isAuthenticated = turunan dari currentUser, bukan state terpisah */
  const isAuthenticated = Boolean(currentUser);

  /** authView steers which auth screen to show */
  const [authView, setAuthView] = React.useState('login');

  /** Sync currentUser → localStorage */
  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  // ── login ────────────────────────────────────────────────────────
  async function login(username, password) {
    try {
      const result = await api.post('/auth/login', { username, password });
      setCurrentUser(result.user);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message.includes('401') ? 'Username atau password salah.' : 'Server database tidak dapat dihubungi.' };
    }
  }

  // ── register ─────────────────────────────────────────────────────
  async function register(username, email, password) {
    const formattedName = username
      .split(/[\s_\-]+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    try {
      const result = await api.post('/auth/register', { username, email: email || `${username}@irigasicerdas.id`, password });
      setCurrentUser(result.user);
      setAuthView('loading');
      setTimeout(() => setAuthView('success'), 1800);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message.includes('409') ? 'Username atau email sudah digunakan.' : 'Server database tidak dapat dihubungi.' };
    }
  }

  // ── enterApp — called by SuccessScreen ───────────────────────────
  // currentUser already set; isAuthenticated = true automatically.
  // Just a no-op to satisfy the prop contract.
  function enterApp() { /* isAuthenticated derives from currentUser */ }

  // ── updateUser — for Settings sync ──────────────────────────────
  function updateUser(patch) {
    setCurrentUser(prev => prev ? { ...prev, ...patch } : prev);
  }

  // ── logout ───────────────────────────────────────────────────────
  function logout() {
    setCurrentUser(null);
    setAuthView('login');
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated, currentUser,
      authView, setAuthView,
      login, register, enterApp, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
