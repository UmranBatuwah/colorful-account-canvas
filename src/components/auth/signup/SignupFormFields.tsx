
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { SignupFormValues } from './schema';

interface SignupFormFieldsProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading?: boolean;
  onSubmit?: (data: SignupFormValues) => Promise<void>;
  hideSubmitButton?: boolean;
}

const SignupFormFields = ({ form, isLoading = false, onSubmit, hideSubmitButton = false }: SignupFormFieldsProps) => {
  const handleSubmit = onSubmit ? form.handleSubmit(onSubmit) : undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="John Doe" 
                {...field} 
                disabled={isLoading} 
                className="h-11"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input 
                placeholder="youremail@example.com" 
                {...field} 
                disabled={isLoading} 
                className="h-11"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="••••••••" 
                {...field} 
                disabled={isLoading} 
                className="h-11"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="••••••••" 
                {...field} 
                disabled={isLoading} 
                className="h-11"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {!hideSubmitButton && (
        <Button 
          type="submit" 
          className="w-full h-11 mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      )}
    </form>
  );
};

export default SignupFormFields;
