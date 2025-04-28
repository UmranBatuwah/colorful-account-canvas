
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Check if there's a user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // This is a mock authentication - in a real app, you would verify with a backend
      if (email && password) {
        // Mock user for demo purposes
        const loggedInUser = {
          id: "123",
          email,
          name: email.split("@")[0],
        };
        
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${loggedInUser.name}!`,
        });
        return Promise.resolve();
      } else {
        return Promise.reject("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: String(error),
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // This is a mock signup - in a real app, you would create an account with a backend
      if (email && password && name) {
        // Mock user for demo purposes
        const newUser = {
          id: "123",
          email,
          name,
        };
        
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        toast({
          title: "Account created successfully",
          description: `Welcome, ${name}!`,
        });
        return Promise.resolve();
      } else {
        return Promise.reject("Please fill all fields");
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: String(error),
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
