
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthCardProps {
  loginContent: ReactNode;
  signupContent: ReactNode;
}

const AuthCard = ({ loginContent, signupContent }: AuthCardProps) => {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <CardContent className="pt-4">
            {loginContent}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="signup">
          <CardContent className="pt-4">
            {signupContent}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthCard;
