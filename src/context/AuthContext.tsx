
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
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
    user_metadata: { first_name: "Guest" },
    app_metadata: {}, // required field
    aud: "authenticated", // required field
    created_at: new Date().toISOString(), // required field
    role: "",
    updated_at: new Date().toISOString(),
  } as User;
  
  const [user, setUser] = useState<User | null>(mockUser);
  const [session, setSession] = useState<Session | null>({ user: mockUser, access_token: "mock-token", refresh_token: "mock-refresh-token" } as Session);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Skip actual authentication checks
    setIsLoading(false);
  }, []);

  // Mock login function - automatically succeeds
  const login = async (email: string, password: string) => {
    return Promise.resolve();
  };

  // Mock signup function - automatically succeeds
  const signup = async (email: string, password: string, name: string) => {
    toast({
      title: "Account created successfully",
      description: `Welcome, ${name}!`,
    });
    return Promise.resolve();
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
        isLoading: false,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
