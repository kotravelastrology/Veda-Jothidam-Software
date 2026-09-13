/**
 * useAuth Hook - React hook for authentication
 * Handles user signup, login, and profile management
 */

import { useState, useCallback, useEffect } from 'react';
import apiService from '@/services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

interface UseAuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<UseAuthState>({
    user: null,
    isAuthenticated: apiService.isAuthenticated(),
    loading: false,
    error: null,
  });

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    if (apiService.isAuthenticated()) {
      loadProfile();
    }
  }, []);

  /**
   * Load user profile
   */
  const loadProfile = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiService.getProfile();
      setState(prev => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Failed to load profile',
        loading: false,
      }));
    }
  }, []);

  /**
   * Sign up new user
   */
  const signup = useCallback(
    async (email: string, password: string, name: string, language: string = 'Tamil') => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const response = await apiService.signup(email, password, name, language);
        setState(prev => ({
          ...prev,
          user: response.user,
          isAuthenticated: true,
          loading: false,
        }));
        return response;
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Signup failed',
          loading: false,
        }));
        throw error;
      }
    },
    []
  );

  /**
   * Login user
   */
  const login = useCallback(
    async (email: string, password: string) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const response = await apiService.login(email, password);
        setState(prev => ({
          ...prev,
          user: response.user,
          isAuthenticated: true,
          loading: false,
        }));
        return response;
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Login failed',
          loading: false,
        }));
        throw error;
      }
    },
    []
  );

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    apiService.logout();
    setState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const response = await apiService.updateProfile(updates);
        setState(prev => ({
          ...prev,
          user: response.user,
          loading: false,
        }));
        return response.user;
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Profile update failed',
          loading: false,
        }));
        throw error;
      }
    },
    []
  );

  /**
   * Change password
   */
  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        await apiService.changePassword(oldPassword, newPassword);
        setState(prev => ({
          ...prev,
          error: null,
          loading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Password change failed',
          loading: false,
        }));
        throw error;
      }
    },
    []
  );

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,

    // Methods
    loadProfile,
    signup,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };
}
