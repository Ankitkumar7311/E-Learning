// src/context/AuthorizedFetch.jsx

export function useApiClient() {
  // configure backend base URL via env (optional)
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/VidyaSarthi'; // CORRECT for Vite

  return async (endpoint, options = {}) => {
    const url = `${baseUrl}${endpoint}`;

    const opts = { ...options };

    if (opts.body && !(opts.body instanceof FormData) && typeof opts.body === 'object') {
      opts.headers = {
        'Content-Type': 'application/json',
        ...(opts.headers || {}),
      };
      opts.body = JSON.stringify(opts.body);
    }

    try {
      const res = await fetch(url, opts);
      return res;
    } catch (err) {
      throw new Error(err?.message || 'Network error');
    }
  };
}