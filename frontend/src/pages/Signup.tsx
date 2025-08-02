import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useAuthForm } from '../hooks/useAuthForm';
import { SignupData } from '../types/auth.types';
import AuthLayout from '../components/layouts/AuthLayout';
import FormInput from '../components/forms/FormInput';
import SubmitButton from '../components/forms/SubmitButton';
import AlertMessage from '../components/ui/AlertMessage';

const Signup = () => {
  const { signup, loading, error, setError } = useAuth();
  const { successMessage, handleSuccess, resetMessages } = useAuthForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>();

  const onSubmit = async (data: SignupData) => {
    setError(null);
    resetMessages();

    const result = await signup(data);
    
    if (result.success) {
      handleSuccess('Account created successfully! Redirecting...');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Or"
      linkText="sign in to your existing account"
      linkTo="/signin"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Email Address"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          register={register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email format'
            }
          })}
        />

        <FormInput
          label="Full Name"
          type="text"
          autoComplete="name"
          error={errors.name?.message}
          register={register('name', {
            required: 'Name is required',
            minLength: {
              value: 3,
              message: 'Name must be at least 3 characters'
            }
          })}
        />

        <FormInput
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          register={register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            },
            validate: {
              hasLetter: (value) => 
                /[A-Za-z]/.test(value) || 'Password must contain at least one letter',
              hasNumber: (value) =>
                /\d/.test(value) || 'Password must contain at least one number',
              hasSpecial: (value) =>
                /[@$!%*#?&]/.test(value) || 'Password must contain at least one special character'
            }
          })}
        />

        {error && <AlertMessage type="error" message={error} />}
        {successMessage && <AlertMessage type="success" message={successMessage} />}

        <SubmitButton loading={loading} disabled={successMessage !== null}>
          Create Account
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};

export default Signup;