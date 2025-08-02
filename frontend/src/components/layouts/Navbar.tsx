import { Button } from '@mui/material';
import { User } from '../../types/auth.types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  appName?: string;
}

const Navbar = ({ user, onLogout, appName = 'Auth App' }: NavbarProps) => (
  <nav className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            {appName}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">
            Welcome, {user?.name || user?.email}!
          </span>
          <Button
            variant="outlined"
            color="primary"
            onClick={onLogout}
            size="small"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;