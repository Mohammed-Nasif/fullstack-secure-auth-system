import { CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  showSubtext?: boolean;
  className?: string;
}

const LoadingSpinner = ({ 
  message = 'Loading...',
  size = 40,
  showSubtext = true,
  className = ''
}: LoadingSpinnerProps) => (
  <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
    <div className="text-center">
      <CircularProgress 
        size={size} 
        className="text-indigo-600" 
      />
      <p className="mt-4 text-gray-600 font-medium">
        {message}
      </p>
      {showSubtext && (
        <p className="mt-1 text-sm text-gray-400">
          Please wait...
        </p>
      )}
    </div>
  </div>
);

export default LoadingSpinner;