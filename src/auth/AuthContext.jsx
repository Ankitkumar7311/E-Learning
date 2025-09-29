// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useMemo } from 'react';

// Key for localStorage
const AUTH_KEY = 'vidyaSarthiAuth';

// Default state - matches your old structure
const DEFAULT_AUTH_STATE = {
  user: null,
  login: () => { console.error('Login called outside AuthProvider'); },
  logout: () => { console.error('Logout called outside AuthProvider'); },
  // New properties for enhanced functionality
  isAuthenticated: false,
  token: null,
  role: null,
  facultyId: null,
};

const AuthContext = createContext(DEFAULT_AUTH_STATE);

// Base URL for API calls
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/VidyaSarthi';

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    // Try to restore from localStorage
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure backward compatibility
        return {
          ...DEFAULT_AUTH_STATE,
          ...parsed,
          isAuthenticated: !!parsed.user,
        };
      } catch (e) {
        console.error('Failed to parse stored auth state:', e);
        localStorage.removeItem(AUTH_KEY); // Clean up corrupted data
      }
    }
    return DEFAULT_AUTH_STATE;
  });

  // Helper to persist state
  const persist = (state) => {
    try {
      // Only persist the data, not the functions
      const toPersist = {
        user: state.user,
        token: state.token,
        role: state.role,
        facultyId: state.facultyId,
        isAuthenticated: state.isAuthenticated,
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(toPersist));
    } catch (e) {
      console.warn('Failed to persist auth state', e);
    }
  };

  // Login function - backward compatible
  const login = async (userData) => {
    let nextState;
    
    // Support both old format (direct user object) and new format
    if (userData && typeof userData === 'object') {
      if ('token' in userData || 'role' in userData || 'user' in userData) {
        // New format - structured auth data
        nextState = {
          user: userData.user || userData,
          token: userData.token || null,
          role: userData.role || userData.user?.role || null,
          facultyId: userData.facultyId || null,
          isAuthenticated: true,
        };
      } else {
        // Old format - just a user object (your existing code uses this)
        nextState = {
          user: userData,
          token: userData.token || null,
          role: userData.role || null,
          facultyId: userData.facultyId || null,
          isAuthenticated: true,
        };
      }
    } else {
      console.error('Invalid userData provided to login');
      return;
    }

    // Update state immediately
    setAuthState(prev => ({ 
      ...prev, 
      ...nextState,
      login: prev.login,  // Preserve functions
      logout: prev.logout 
    }));
    persist(nextState);

    // Try to fetch facultyId if we have an email and don't have facultyId
    if (!nextState.facultyId) {
      const email = nextState.user?.email || userData.email;
      if (email) {
        try {
          const res = await fetch(`${BASE_URL}/getFacultyId`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              ...(nextState.token ? { Authorization: `Bearer ${nextState.token}` } : {})
            },
            body: JSON.stringify({ email }),
          });

          if (res.ok) {
            const payload = await res.json();
            const facultyId = payload?.facultyId || payload?.facultyID || payload?.facultyid;
            
            if (facultyId) {
              const updatedState = { ...nextState, facultyId };
              setAuthState(prev => ({ 
                ...prev, 
                facultyId,
                login: prev.login,
                logout: prev.logout 
              }));
              persist(updatedState);
            }
          } else {
            console.warn('getFacultyId returned', res.status, res.statusText);
          }
        } catch (e) {
          console.warn('Failed to fetch facultyId:', e);
        }
      }
    }

    return nextState;
  };

  // Logout function
  const logout = () => {
    setAuthState({
      ...DEFAULT_AUTH_STATE,
      login,  // Keep the functions
      logout
    });
    localStorage.removeItem(AUTH_KEY);
  };

  // Create context value with all properties at root level
  const contextValue = useMemo(() => ({
    // Core properties that your existing code expects
    user: authState.user,
    login,
    logout,
    // Enhanced properties for new features
    isAuthenticated: authState.isAuthenticated || !!authState.user,
    token: authState.token,
    role: authState.role,
    facultyId: authState.facultyId,
  }), [authState]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Enhanced useAuth hook with safety check
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Safety check - return a valid object even if context fails
  if (context === undefined) {
    console.error('useAuth must be used within an AuthProvider');
    // Return a safe default that won't crash destructuring
    return {
      user: null,
      login: () => console.error('AuthProvider not found'),
      logout: () => console.error('AuthProvider not found'),
      isAuthenticated: false,
      token: null,
      role: null,
      facultyId: null,
    };
  }
  
  return context;
};