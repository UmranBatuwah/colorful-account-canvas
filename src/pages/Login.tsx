
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout 
      title="Welcome Back"
      subtitle="Sign in to continue to your account"
      linkText="Don't have an account? Sign up"
      linkTo="/signup"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
