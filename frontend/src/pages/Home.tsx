import { Alert } from '@mui/material';
import { useProfile } from '../hooks/useProfile';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/layouts/Navbar';
import ProfileCard from '../components/ui/ProfileCard';

const Home = () => {
  const { user, loading, error, handleLogout } = useProfile();

  if (loading) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert severity="error">{error || 'Failed to load user data'}</Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <ProfileCard user={user} />
        </div>
      </main>
    </div>
  );
};

export default Home;