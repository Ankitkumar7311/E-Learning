import React, { createContext, useContext, useState, useMemo } from 'react';

// Key for localStorage
const AUTH_KEY = 'vidyaSarthiAuth';

const DEFAULT_AUTH_STATE = {
  isAuthenticated: false,
  token: null,
  user: null,
  role: null,
  facultyId: null,
  login: () => { console.error('Login called outside AuthProvider'); },
  logout: () => { console.error('Logout called outside AuthProvider'); },
};

const AuthContext = createContext(DEFAULT_AUTH_STATE);

// convenience: baseUrl used by your app's fetch helper
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/VidyaSarthi';

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    try {
      return stored ? { ...DEFAULT_AUTH_STATE, ...JSON.parse(stored) } : DEFAULT_AUTH_STATE;
    } catch (e) {
      console.error('Failed to parse stored auth state:', e);
      return DEFAULT_AUTH_STATE;
    }
  });

  // helper to persist state
  const persist = (next) => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to persist auth state', e);
    }
  };

  // login: accepts an object { token, user, role, email }
  // After saving token/user it will call /getFacultyId with { email } and persist facultyId if returned.
  const login = async (data) => {
    const next = {
      isAuthenticated: true,
      token: data.token || null,
      user: data.user || null,
      role: data.role || null,
      facultyId: data.facultyId || null,
    };

    setAuthState(next);
    persist(next);

    // if facultyId was provided by caller, nothing to fetch
    if (next.facultyId) return next;

    // otherwise try to fetch facultyId from server using email
    const email = next.user?.email || (data.email || null);
    if (!email) return next;

    try {
      const res = await fetch(`${BASE_URL}/getFacultyId`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(next.token ? { Authorization: `Bearer ${next.token}` } : {}) },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        console.warn('getFacultyId returned', res.status, res.statusText);
        return next;
      }

      const payload = await res.json();
      const facultyId = payload?.facultyId || payload?.facultyID || payload?.facultyid;
      if (facultyId) {
        const merged = { ...next, facultyId };
        setAuthState(merged);
        persist(merged);
        return merged;
      }
    } catch (e) {
      console.warn('Failed to fetch facultyId during login', e);
    }

    return next;
  };

  // logout: clear everything
  const logout = () => {
    setAuthState(DEFAULT_AUTH_STATE);
    try { localStorage.removeItem(AUTH_KEY); } catch (e) { console.warn('Failed to remove auth key', e); }
  };

  const contextValue = useMemo(() => ({ ...authState, login, logout }), [authState]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
