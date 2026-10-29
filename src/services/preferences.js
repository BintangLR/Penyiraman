export const TIMEZONES = {
  WIB: 'Asia/Jakarta',
  WITA: 'Asia/Makassar',
  WIT: 'Asia/Jayapura',
};

export const DEFAULT_TIMEZONE = TIMEZONES.WITA;
export const DEFAULT_THEME = 'light';

export function safeTimezone(value) {
  const candidate = String(value || '');
  return Object.values(TIMEZONES).includes(candidate) ? candidate : DEFAULT_TIMEZONE;
}

export function safeTheme(value) {
  return value === 'dark' ? 'dark' : DEFAULT_THEME;
}
