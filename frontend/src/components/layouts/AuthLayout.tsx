import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  linkText: string;
  linkTo: string;
  children: React.ReactNode;
}

const AuthLayout = ({
  title,
  subtitle,
  linkText,
  linkTo,
  children,
}: AuthLayoutProps) => (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {title}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        {subtitle}{' '}
        <Link
          to={linkTo}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {linkText}
        </Link>
      </p>
    </div>

    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;