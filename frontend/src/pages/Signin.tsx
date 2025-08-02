import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useAuthForm } from '../hooks/useAuthForm';
import { SigninData } from '../types/auth.types';
import AuthLayout from '../components/layouts/AuthLayout';
import FormInput from '../components/forms/FormInput';
import SubmitButton from '../components/forms/SubmitButton';
import AlertMessage from '../components/ui/AlertMessage';

const Signin = () => {
  const { signin, loading, error, setError } = useAuth();
  const { successMessage, handleSuccess, resetMessages } = useAuthForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninData>();

  const onSubmit = async (data: SigninData) => {
    setError(null);
    resetMessages();

    const result = await signin(data);
    
    if (result.success) {
      handleSuccess('Signed in successfully! Redirecting...');
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Or"
      linkText="create a new account"
      linkTo="/signup"
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
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          register={register('password', {
            required: 'Password is required'
          })}
        />

        {error && <AlertMessage type="error" message={error} />}
        {successMessage && <AlertMessage type="success" message={successMessage} />}

        <SubmitButton loading={loading}>
          Sign In
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};

export default Signin;