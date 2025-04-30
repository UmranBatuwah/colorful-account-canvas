
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from '@/components/auth/signup/SignupForm';

const Signup = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout 
      title="Create Account"
      subtitle="Sign up to get started with FinTrackr"
      linkText="Already have an account? Sign in"
      linkTo="/login"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;
