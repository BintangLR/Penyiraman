import React from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const contentType = response.headers.get('content-type') || '';
  const body = await response.text();
  if (!response.ok) {
    const detail = body.trim() && contentType.includes('application/json')
      ? (() => { try { return JSON.parse(body).message; } catch { return body.trim(); } })()
      : body.trim();
    throw new Error(`API ${response.status}${detail ? `: ${detail}` : ''}`);
  }
  if (response.status === 204 || !body.trim()) return null;
  if (!contentType.includes('application/json')) throw new Error('Respons API bukan JSON yang valid.');
  try { return JSON.parse(body); } catch { throw new Error('Respons API berisi JSON yang tidak valid.'); }
}

export const api = {
  get: path => request(path),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  delete: path => request(path, { method: 'DELETE' }),
};

export function useApi(path, initialValue) {
  const [data, setData] = React.useState(initialValue);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  React.useEffect(() => {
    let active = true;
    setLoading(true);
    api.get(path).then(value => { if (active) { setData(value); setError(''); } })
      .catch(err => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [path]);
  return { data, setData, loading, error };
}
