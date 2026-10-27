import React from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!response.ok) throw new Error(`API ${response.status}: ${await response.text()}`);
  return response.status === 204 ? null : response.json();
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
    api.get(path).then(value => active && setData(value))
      .catch(err => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [path]);
  return { data, setData, loading, error };
}
