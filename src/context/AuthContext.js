import React, { createContext, useContext, useState, useEffect } from 'react';
import { authUtils } from '../utils/auth';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount and when needed
  const checkAuthStatus = () => {
    const authenticated = authUtils.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      const userData = authUtils.getCurrentUser();
      setUser(userData);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  // Initialize auth status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Login function
  const login = (token, userData) => {
    authUtils.setAuthData(token, userData);
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    authUtils.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Refresh auth state
  const refreshAuth = () => {
    checkAuthStatus();
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 