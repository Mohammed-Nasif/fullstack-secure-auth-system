import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { User } from '../types/auth.types';

enum AuthState {
  CHECKING = 'checking',
  AUTHENTICATED = 'authenticated', 
  UNAUTHENTICATED = 'unauthenticated'
}

interface AuthGuardState {
  user: User | null;
  authState: AuthState;
  isLoading: boolean;
  hasChecked: boolean;
}

export const useAuthGuard = (): AuthGuardState => {
  const { getProfile } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>(AuthState.CHECKING);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const verifyAuthentication = async () => {
      if (hasChecked) return;

      try {
        setAuthState(AuthState.CHECKING);
        
        const userData = await getProfile();
        
        if (userData) {
          setUser(userData);
          setAuthState(AuthState.AUTHENTICATED);
        } else {
          setUser(null);
          setAuthState(AuthState.UNAUTHENTICATED);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        setUser(null);
        setAuthState(AuthState.UNAUTHENTICATED);
      } finally {
        setHasChecked(true);
      }
    };

    verifyAuthentication();
  }, [getProfile, hasChecked]);

  return {
    user,
    authState,
    isLoading: authState === AuthState.CHECKING || !hasChecked,
    hasChecked,
  };
};

export { AuthState };