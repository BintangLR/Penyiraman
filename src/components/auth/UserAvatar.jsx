import React from 'react';
import { getInitials } from '../../context/AuthContext';

/**
 * Komponen avatar lingkaran dengan inisial nama.
 * size: 'sm' | 'md' | 'lg'
 */
export function UserAvatar({ name = '', size = 'md', style }) {
  const initials = getInitials(name);
  const sizes = { sm: 28, md: 34, lg: 48 };
  const fonts = { sm: 10, md: 12, lg: 17 };
  const px = sizes[size] ?? 34;
  const fs = fonts[size] ?? 12;

  return (
    <div
      className="user-avatar"
      style={{
        width: px, height: px, minWidth: px,
        fontSize: fs, borderRadius: '50%',
        background: '#dcf0e7', color: '#17372b',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, letterSpacing: '-.02em', userSelect: 'none',
        flexShrink: 0, ...style,
      }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
