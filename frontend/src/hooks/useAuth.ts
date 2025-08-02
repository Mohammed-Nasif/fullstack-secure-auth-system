import { useState, useCallback, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authApi, setAuthFailureCallback } from '../services/authApi';
import { SignupData, SigninData, User, AuthHookReturn } from '../types/auth.types';

export const useAuth = (): AuthHookReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Set up auth failure callback on mount
  useEffect(() => {
    setAuthFailureCallback(() => {
      // Clear any stored state and redirect to signin
      setError('Your session has expired. Please sign in again.');
      navigate('/signin', { replace: true });
    });
  }, [navigate]);

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
      setError(null);
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
      const message = axios.isAxiosError(err) && err.response?.data?.message || 'Session expired';
      setError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const getProfile = useCallback(async (): Promise<User | null> => {
    try {
      return await authApi.getProfile();
    } catch (err) {
      // The axios interceptor will handle 401s automatically

      if (axios.isAxiosError(err) && err.response?.status === 401) {
        // This means refresh failed and user is being redirected
        return null;
      }
      console.error('Profile fetch error:', err);
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