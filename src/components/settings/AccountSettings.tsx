import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const createPasswordFormSchema = z.object({
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type CreatePasswordFormValues = z.infer<typeof createPasswordFormSchema>;

const AccountSettings = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkPasswordStatus = async () => {
      try {
        const { data: { user: userData } } = await supabase.auth.getUser();
        // Check if user has email provider and has set a password
        const hasEmailProvider = userData?.app_metadata?.provider === 'email';
        const hasSetPassword = userData?.app_metadata?.has_password === true;
        setHasPassword(hasEmailProvider && hasSetPassword);
      } catch (error) {
        console.error('Error checking password status:', error);
        setHasPassword(false);
      }
    };
    
    checkPasswordStatus();
  }, []);
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const createPasswordForm = useForm<CreatePasswordFormValues>({
    resolver: zodResolver(createPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const onSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    try {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: data.currentPassword,
      });

      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      // Then update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (updateError) {
        throw updateError;
      }
      
      passwordForm.reset();
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onCreatePassword = async (data: CreatePasswordFormValues) => {
    setIsLoading(true);
    try {
      // Check if user has email provider
      const { data: { user: userData } } = await supabase.auth.getUser();
      
      if (!userData?.email) {
        throw new Error('Email is required to create a password');
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (updateError) {
        throw updateError;
      }

      // Update user metadata to indicate password has been set
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { has_password: true }
      });
      
      if (metadataError) {
        throw metadataError;
      }
      
      createPasswordForm.reset();
      setHasPassword(true);
      
      toast({
        title: "Password created",
        description: "Your password has been created successfully.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "Failed to create password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    // This would be implemented with Supabase in a real application
    toast({
      title: "Account deletion",
      description: "This feature is not implemented yet.",
      variant: "destructive",
    });
  };
  
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/auth');
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (hasPassword === null) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{hasPassword ? 'Change Password' : 'Create Password'}</CardTitle>
          <CardDescription>
            {hasPassword 
              ? 'Update your password to keep your account secure.'
              : 'Create a password to secure your account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasPassword ? (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? 'Updating...' : 'Update password'}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...createPasswordForm}>
              <form onSubmit={createPasswordForm.handleSubmit(onCreatePassword)} className="space-y-4">
                <FormField
                  control={createPasswordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createPasswordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? 'Creating...' : 'Create password'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account session and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Logout</h4>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all of your data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/50 flex gap-4 items-start">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium">Delete account</h4>
              <p className="text-sm text-muted-foreground mt-1">
                This action is irreversible. All your data will be permanently removed.
                This includes your profile, transactions, invoices, and all other associated data.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-destructive/50 bg-destructive/5">
          <Button variant="destructive" onClick={handleDeleteAccount} className="w-full sm:w-auto">
            Delete Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountSettings;
