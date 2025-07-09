import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authUtils } from '../utils/auth';
import { selectIsAuthenticated, selectAuthUser, initializeAuth } from '../store/slices/authSlice';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const reduxIsAuthenticated = useSelector(selectIsAuthenticated);
  const reduxUser = useSelector(selectAuthUser);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount and when needed
  const checkAuthStatus = () => {
    const authenticated = authUtils.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      const userData = authUtils.getCurrentUser();
      const userId = authUtils.getCurrentUserId();
      
      if (userData) {
        setUser(userData);
      } else if (userId) {
        // Create basic user object from userId if userData is not available
        setUser({
          id: userId,
          // Other fields will be populated when user data is fetched
        });
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  // Initialize auth status and sync with Redux
  useEffect(() => {
    // Initialize Redux auth state
    dispatch(initializeAuth());
    
    // Check local auth status
    checkAuthStatus();
  }, [dispatch]);

  // Sync with Redux state changes
  useEffect(() => {
    setIsAuthenticated(reduxIsAuthenticated);
    setUser(reduxUser);
  }, [reduxIsAuthenticated, reduxUser]);

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