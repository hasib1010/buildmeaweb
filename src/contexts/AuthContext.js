// src/contexts/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  
  const router = useRouter();
  
  // Load user on initial load
  useEffect(() => {
    loadUser();
  }, []);
  
  // Function to fetch current user data
  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/auth/me');
      
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Register user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });
      
      if (res.data.success) {
        // Don't set user - they need to verify their email first
        setVerificationRequired(true);
        setVerificationEmail(email);
        return true;
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      setVerificationRequired(false);
      
      const res = await axios.post('/api/auth/login', {
        email,
        password,
      });
      
      if (res.data.success) {
        setUser(res.data.user);
        router.push('/dashboard');
        return true;
      }
    } catch (error) {
      // Check if email verification is required
      if (error.response?.data?.requiresVerification) {
        setVerificationRequired(true);
        setVerificationEmail(error.response.data.email);
        setError('Please verify your email before logging in.');
        return false;
      }
      
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      
      await axios.post('/api/auth/logout');
      
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Resend verification email
  const resendVerification = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/auth/resend-verification', {
        email: email || verificationEmail,
      });
      
      if (res.data.success) {
        return true;
      } else {
        throw new Error(res.data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Failed to resend verification email. Please try again.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Verify email
  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/auth/verify-email', { token });
      
      if (res.data.success) {
        setUser(res.data.user);
        return {
          success: true,
          message: res.data.message || 'Email verified successfully',
        };
      } else {
        throw new Error(res.data.message || 'Failed to verify email');
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to verify email. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        verificationRequired,
        verificationEmail,
        register,
        login,
        logout,
        resendVerification,
        verifyEmail,
      }}
    >
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