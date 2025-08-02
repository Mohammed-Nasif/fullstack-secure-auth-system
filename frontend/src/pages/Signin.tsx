import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { SigninData } from '../types/auth.types';

const Signin = () => {
  const navigate = useNavigate();
  const { signin, loading, error, setError } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninData>();

  const onSubmit = async (data: SigninData) => {
    setError(null);
    setSuccessMessage(null);

    const result = await signin(data);
    
    if (result.success) {
      setSuccessMessage('Signed in successfully! Redirecting...');
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email format'
                  }
                })}
                variant="outlined"
                size="medium"
              />
            </div>

            {/* Password Field */}
            <div>
              <TextField
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', {
                  required: 'Password is required'
                })}
                variant="outlined"
                size="medium"
              />
            </div>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" className="mt-4">
                {error}
              </Alert>
            )}

            {/* Success Alert */}
            {successMessage && (
              <Alert severity="success" className="mt-4">
                {successMessage}
              </Alert>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;