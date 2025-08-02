import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseAuthFormReturn {
  successMessage: string | null;
  navigate: ReturnType<typeof useNavigate>;
  handleSuccess: (message: string, redirectTo?: string) => void;
  resetMessages: () => void;
}

export const useAuthForm = (): UseAuthFormReturn => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSuccess = (message: string, redirectTo = '/home') => {
    setSuccessMessage(message);
    setTimeout(() => {
      navigate(redirectTo);
    }, 1500);
  };

  const resetMessages = () => {
    setSuccessMessage(null);
  };

  return {
    successMessage,
    navigate,
    handleSuccess,
    resetMessages,
  };
};