import { useState, useCallback } from 'react';
import axios from 'axios';
import { authApi } from '../services/authApi';
import { SignupData, SigninData, User, AuthHookReturn } from '../types/auth.types';

export const useAuth = (): AuthHookReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = useCallback(async (data: SignupData): Promise<{ success: boolean; user?: User }> => {
    setLoading(true);
    setError(null);

    try {
      const user = await authApi.signup(data);
      return { success: true, user };
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) && err.response?.data?.message || 'Signup failed';
      setError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const signin = useCallback(async (data: SigninData): Promise<{ success: boolean }> => {
    setLoading(true);
    setError(null);

    try {
      await authApi.signin(data);
      return { success: true };
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) && err.response?.data?.message || 'Invalid credentials';
      setError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<{ success: boolean }> => {
    setLoading(true);
    setError(null);

    try {
      await authApi.refreshToken();
      return { success: true };
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) && err.response?.data?.message || 'Token refresh failed';
      setError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const getProfile = useCallback(async (): Promise<User | null> => {
    try {
      return await authApi.getProfile();
    } catch {
      return null;
    }
  }, []);

  return {
    signup,
    signin,
    logout,
    refreshToken,
    getProfile,
    loading,
    error,
    setError,
  };
};