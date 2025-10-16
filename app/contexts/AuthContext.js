'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        const response = await adminAPI.getProfile();
        setAdmin(response.data.admin);
      }
    } catch (error) {
      console.log('Auth check failed:', error);
      localStorage.removeItem('adminToken');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      console.log('Making login request...');
      const response = await adminAPI.login(username, password);
      console.log('Login response:', response);
      
      // Check if response.data exists
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      
      const { token, data } = response.data;
      
      console.log('Token:', token);
      console.log('Admin data:', data.admin);
      
      localStorage.setItem('adminToken', token);
      setAdmin(data.admin); // This should trigger re-renders
      
      console.log('Admin state updated successfully');
      
      return { success: true, admin: data.admin };
    } catch (error) {
      console.log('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  const value = {
    admin,
    login,
    logout,
    loading,
    isAuthenticated: !!admin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};