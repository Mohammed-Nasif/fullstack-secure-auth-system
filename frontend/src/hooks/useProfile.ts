import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { User } from '../types/auth.types';

interface UseProfileReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  handleLogout: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const navigate = useNavigate();
  const { logout, getProfile } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userData = await getProfile();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [getProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch {
      setError('Logout failed. Please try again.');
    }
  };

  return {
    user,
    loading,
    error,
    handleLogout,
  };
};