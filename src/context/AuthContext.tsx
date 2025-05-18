
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

// Define available user roles
export type UserRole = 'admin' | 'manager' | 'user';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Create a mock user that matches the User type from Supabase
  const mockUser = {
    id: "mock-user-id",
    email: "user@example.com",
    user_metadata: { first_name: "Guest", role: 'admin' },
    app_metadata: {}, // required field
    aud: "authenticated", // required field
    created_at: new Date().toISOString(), // required field
    role: "",
    updated_at: new Date().toISOString(),
  } as User;
  
  const [user, setUser] = useState<User | null>(mockUser);
  const [session, setSession] = useState<Session | null>({ user: mockUser, access_token: "mock-token", refresh_token: "mock-refresh-token" } as Session);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const { toast } = useToast();
  
  useEffect(() => {
    // Skip actual authentication checks
    setIsLoading(false);
  }, []);

  // Function to check if user has required role access
  const hasAccess = (requiredRoles: UserRole[]): boolean => {
    if (!requiredRoles.length) return true;
    return requiredRoles.includes(userRole);
  };

  // Mock login function - automatically succeeds
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would verify credentials and set the correct role
      const role = email.includes('admin') ? 'admin' : 
                  email.includes('manager') ? 'manager' : 'user';
      setUserRole(role as UserRole);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${role}!`,
      });
      return Promise.resolve();
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function with role assignment
  const signup = async (email: string, password: string, name: string, role: UserRole = 'user') => {
    setIsLoading(true);
    try {
      // In a real app, this would register the user with the specified role
      setUserRole(role);
      
      toast({
        title: "Account created successfully",
        description: `Welcome, ${name}! You have been assigned the role: ${role}`,
      });
      return Promise.resolve();
    } finally {
      setIsLoading(false);
    }
  };

  // Mock logout function - does nothing
  const logout = async () => {
    // No actual logout needed
  };

  return (
    <AuthContext.Provider
      value={{
        user: mockUser,
        session: { user: mockUser, access_token: "mock-token", refresh_token: "mock-refresh-token" } as Session,
        isAuthenticated: true, // Always authenticated
        isLoading,
        userRole,
        hasAccess,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
