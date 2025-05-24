import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/auth/LoginForm';
import SignupFormWithRole from '@/components/auth/signup/SignupFormWithRole';
import AuthCard from '@/components/auth/AuthCard';

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Promode Agro Farms</h1>
          <p className="text-gray-600 mt-2">Manage your finances efficiently</p>
        </div>
        
        <AuthCard 
          loginContent={<LoginForm />} 
          signupContent={<SignupFormWithRole />} 
        />
      </div>
    </div>
  );
};

export default Auth;
