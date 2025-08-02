import { Navigate } from 'react-router-dom';
import { useAuthGuard, AuthState } from '../../hooks/useAuthGuard';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  loadingMessage?: string;
  showUserInfo?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = '/signin',
  loadingMessage = 'Verifying authentication...',
  showUserInfo = false
}: ProtectedRouteProps) => {
  const { authState, isLoading, user } = useAuthGuard();

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  switch (authState) {
    case AuthState.CHECKING:
      return <LoadingSpinner message={loadingMessage} />;
      
    case AuthState.UNAUTHENTICATED:
      return <Navigate to={redirectTo} replace />;
      
    case AuthState.AUTHENTICATED:
      if (showUserInfo && user) {
        console.log('✅ Authenticated user:', user.name);
      }
      return <>{children}</>;
      
    default:
      // Fallback case - should never happen with proper typing
      console.error('Unknown auth state:', authState);
      return <Navigate to={redirectTo} replace />;
  }
};

export default ProtectedRoute;