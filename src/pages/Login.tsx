
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <AuthLayout 
      title="Welcome Back"
      subtitle="Enter your credentials to access your account"
      linkText="Don't have an account? Sign up"
      linkTo="/signup"
    >
      <LoginForm />
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>This is a demo application with role-based access control.</p>
        <p>Use the quick login buttons to try different roles.</p>
        <p className="mt-2">
          <Link to="/auth" className="text-blue-600 hover:underline">
            Go to Auth Page
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
