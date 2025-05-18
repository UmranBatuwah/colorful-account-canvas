
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  
  // Automatically redirect to dashboard when login button is clicked
  const handleAutoLogin = () => {
    navigate('/dashboard');
  };

  return (
    <AuthLayout 
      title="Welcome Back"
      subtitle="Click login to continue to the dashboard"
      linkText="Don't have an account? Sign up"
      linkTo="/signup"
    >
      <div className="space-y-4">
        <button 
          onClick={handleAutoLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded"
        >
          Login to Dashboard
        </button>
      </div>
    </AuthLayout>
  );
};

export default Login;
