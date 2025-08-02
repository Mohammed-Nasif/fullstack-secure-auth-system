import { Alert } from '@mui/material';

interface AlertMessageProps {
  type: 'error' | 'success' | 'info' | 'warning';
  message: string;
  className?: string;
}

const AlertMessage = ({ type, message, className = 'mt-4' }: AlertMessageProps) => (
  <Alert severity={type} className={className}>
    {message}
  </Alert>
);

export default AlertMessage;