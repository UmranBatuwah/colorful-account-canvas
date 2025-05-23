import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

// Define available user roles
export type UserRole = 'admin' | 'user';

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check user role if logged in
        if (currentSession?.user) {
          setUserRole((currentSession.user.user_metadata?.role as UserRole) || 'user');
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        setUserRole((currentSession.user.user_metadata?.role as UserRole) || 'user');
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to check if user has required role access
  const hasAccess = (requiredRoles: UserRole[]): boolean => {
    if (!requiredRoles.length) return true;
    return requiredRoles.includes(userRole);
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
        setUserRole((data.user.user_metadata?.role as UserRole) || 'user');
        
        toast({
          title: "Login successful",
          description: `Welcome back!`,
        });
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function with role assignment
  const signup = async (email: string, password: string, name: string, role: UserRole = 'user') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: name,
            role: role,
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
        setUserRole(role);
        
        toast({
          title: "Account created successfully",
          description: `Welcome, ${name}! You have been assigned the role: ${role}`,
        });
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserRole('user');
      navigate('/login');
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
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
