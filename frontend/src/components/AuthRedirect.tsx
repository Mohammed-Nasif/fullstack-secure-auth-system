import { Navigate } from 'react-router-dom';
import { useAuthGuard, AuthState } from '../hooks/useAuthGuard';
import LoadingSpinner from './LoadingSpinner';

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AuthRedirect = ({ 
  children, 
  redirectTo = '/home'
}: AuthRedirectProps) => {
  const { authState, isLoading } = useAuthGuard();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  switch (authState) {
    case AuthState.CHECKING:
      return <LoadingSpinner message="Checking authentication..." />;
      
    case AuthState.AUTHENTICATED:
      // User is authenticated, redirect them to home
      return <Navigate to={redirectTo} replace />;
      
    case AuthState.UNAUTHENTICATED:
      // User is not authenticated, show the auth page (signin/signup)
      return <>{children}</>;
      
    default:
      // Fallback case
      return <>{children}</>;
  }
};

export default AuthRedirect;