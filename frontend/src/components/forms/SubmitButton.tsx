import { CircularProgress } from '@mui/material';

interface SubmitButtonProps {
  loading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const SubmitButton = ({
  loading,
  children,
  disabled = false,
  className = ''
}: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={loading || disabled}
    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {loading ? (
      <CircularProgress size={20} color="inherit" />
    ) : (
      children
    )}
  </button>
);

export default SubmitButton;