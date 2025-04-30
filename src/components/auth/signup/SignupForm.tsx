
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { signupFormSchema, SignupFormValues } from './schema';
import GoogleSignupButton from './GoogleSignupButton';
import SignupFormFields from './SignupFormFields';

const SignupForm = () => {
  const { signup, signupWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      await signup(data.email, data.password, data.name);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error instanceof Error ? error.message : 'Please check your information and try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      await signupWithGoogle();
      // The redirect will happen automatically by Supabase
    } catch (error) {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <GoogleSignupButton onGoogleSignup={handleGoogleSignup} disabled={isLoading} />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <Form {...form}>
        <SignupFormFields form={form} isLoading={isLoading} onSubmit={onSubmit} />
      </Form>
    </div>
  );
};

export default SignupForm;
