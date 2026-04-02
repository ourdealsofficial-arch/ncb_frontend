import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (storedToken && storedUser) {
      try {
        // Check if token is expired (only if tokenExpiry exists)
        if (tokenExpiry) {
          const expiryTimestamp = parseInt(tokenExpiry);
          if (!isNaN(expiryTimestamp) && Date.now() > expiryTimestamp) {
            console.log('Token expired, logging out');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenExpiry');
            setLoading(false);
            return;
          }
        }

        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiry');
      }
    }
    setLoading(false);
  }, []);

  // Check token expiration periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiry = () => {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (tokenExpiry) {
        const expiryTimestamp = parseInt(tokenExpiry);
        if (!isNaN(expiryTimestamp) && Date.now() > expiryTimestamp) {
          console.log('Token expired during session, logging out');
          logout();
          window.location.href = '/login';
        }
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: authToken, user: userData } = response.data;

      console.log('Login response received:', { 
        hasToken: !!authToken, 
        hasUser: !!userData,
        userRole: userData?.role 
      });

      // Store token and user data
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Store token expiry time (24 hours from now as default)
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem('tokenExpiry', expiryTime.toString());

      console.log('Token and user data stored in localStorage');

      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);

      console.log('Auth state updated successfully');

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');

    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
