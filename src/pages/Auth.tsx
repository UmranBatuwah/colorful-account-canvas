
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import SignupFormSimple from '@/components/auth/SignupFormSimple';
import AuthCard from '@/components/auth/AuthCard';

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
      
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Finance Manager</h1>
          <p className="text-gray-600 mt-2">Manage your finances efficiently</p>
        </div>
        
        <AuthCard 
          loginContent={<LoginForm />} 
          signupContent={<SignupFormSimple />} 
        />
      </div>
    </div>
  );
};

export default Auth;
