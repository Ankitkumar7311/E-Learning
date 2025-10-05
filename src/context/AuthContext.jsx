// src/auth/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Prefer vidyaSarthiAuth (if present) for token & facultyId compatibility with legacy code
        const vsRaw = localStorage.getItem('vidyaSarthiAuth');
        const token = localStorage.getItem('token') || (vsRaw ? (JSON.parse(vsRaw || '{}')?.token) : null);
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');

        console.log('🔍 Checking existing auth:', { token: !!token, storedUser, storedRole });

        if (token && storedUser && storedRole) {
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
          setRole(storedRole);
          console.log('✅ Restored session:', { role: storedRole });
        }
      } catch (error) {
        console.error('❌ Error checking auth:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials) => {
    console.log('🔐 Login function called with:', credentials);
    
    try {
      // YOUR BACKEND EXPECTS "username" not "email"
      const loginPayload = {
        username: credentials.email || credentials.username,
        password: credentials.password
      };
      
      console.log('📤 Sending to backend:', loginPayload);
      
      // YOUR ACTUAL BACKEND LOGIN ENDPOINT
      const response = await fetch('http://localhost:8080/VidyaSarthi/loginAcc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginPayload),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        console.error('❌ Login failed:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('✅ RAW Login response data:', data);

      // Validate response has required fields
      if (!data.success) {
        throw new Error('Login was not successful');
      }

      if (!data.token || !data.role || !data.userId) {
        console.error('❌ Missing required fields:', data);
        throw new Error('Invalid response from server');
      }

      // YOUR BACKEND RETURNS: { token, role, success, email, userId }
      const token = data.token;
      const userRole = data.role; // "Faculty", "Student", or "Admin"
      
      // Build user object
      const userData = {
        userId: data.userId,
        email: data.email,
        role: userRole,
      };

      // Add role-specific ID fields
      if (userRole === 'Faculty') {
        userData.facultyId = data.userId;
      } else if (userRole === 'Student') {
        userData.studentId = data.userId;
      } else if (userRole === 'Admin') {
        userData.adminId = data.userId;
      }

      // Normalize role to lowercase for routing
      const normalizedRole = userRole.toLowerCase();

      console.log('🔄 Processed login data:', { 
        token: !!token, 
        userData, 
        normalizedRole 
      });

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', normalizedRole);

      // Also keep vidyaSarthiAuth key for compatibility with other modules that rely on it
      try {
        const vs = { token };
        // include facultyId if present (so other code can read it)
        if (userData.facultyId) vs.facultyId = userData.facultyId;
        localStorage.setItem('vidyaSarthiAuth', JSON.stringify(vs));
      } catch (err) {
        console.warn('Could not write vidyaSarthiAuth to localStorage', err);
      }

      console.log('💾 Saved to localStorage:', { 
        token: !!token, 
        user: userData, 
        role: normalizedRole 
      });

      // Update state
      setIsAuthenticated(true);
      setUser(userData);
      setRole(normalizedRole);

      console.log('🎉 Auth state updated:', { 
        isAuthenticated: true, 
        user: userData, 
        role: normalizedRole 
      });

      // IMPORTANT: Return the auth state for the Login component
      return {
        isAuthenticated: true,
        user: userData,
        role: normalizedRole,
        token
      };

    } catch (error) {
      console.error('❌ Login error in AuthContext:', error);
      logout(); // Clear any partial state
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');

    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('vidyaSarthiAuth'); // ensure compatibility with other modules
    } catch (err) {
      console.warn('Error clearing local auth storage:', err);
    }

    setIsAuthenticated(false);
    setUser(null);
    setRole(null);

    // notify any listeners in the app that a logout happened
    try {
      window.dispatchEvent(new CustomEvent('app:logout'));
    } catch (e) {
      // ignore
    }

    console.log('✅ Logged out successfully');
  };

  const value = {
    isAuthenticated,
    user,
    role,
    loading,
    login,
    logout,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
