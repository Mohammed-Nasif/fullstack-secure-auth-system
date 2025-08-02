import { TextField } from '@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps {
  label: string;
  type?: string;
  autoComplete?: string;
  error?: string;
  register: UseFormRegisterReturn;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const FormInput = ({
  label,
  type = 'text',
  autoComplete,
  error,
  register,
  variant = 'outlined',
  size = 'medium',
  fullWidth = true
}: FormInputProps) => (
  <TextField
    fullWidth={fullWidth}
    label={label}
    type={type}
    autoComplete={autoComplete}
    error={!!error}
    helperText={error}
    {...register}
    variant={variant}
    size={size}
  />
);

export default FormInput;