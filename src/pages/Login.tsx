
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';

const Login = () => {
  const navigate = useNavigate();
  
  // Automatically navigate to dashboard on component mount
  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return (
    <AuthLayout 
      title="Welcome Back"
      subtitle="Redirecting to dashboard..."
      linkText="Don't have an account? Sign up"
      linkTo="/signup"
    >
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </AuthLayout>
  );
};

export default Login;
