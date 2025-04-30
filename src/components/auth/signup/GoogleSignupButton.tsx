
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GoogleSignupButtonProps {
  onGoogleSignup: () => Promise<void>;
  disabled?: boolean;
}

const GoogleSignupButton = ({ onGoogleSignup, disabled }: GoogleSignupButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await onGoogleSignup();
      // The redirect will happen automatically by Supabase
    } catch (error) {
      toast({
        title: 'Google signup failed',
        description: error instanceof Error ? error.message : 'An error occurred during Google signup',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignup}
      disabled={isLoading || disabled}
      className="w-full h-11 flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
      ) : (
        <Mail className="h-5 w-5" />
      )}
      <span>Sign up with Gmail</span>
    </Button>
  );
};

export default GoogleSignupButton;
