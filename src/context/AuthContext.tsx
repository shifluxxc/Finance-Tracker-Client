import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLogin, useRegister } from "@/hooks/auth";
type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const { mutateAsync: registerMutation } = useRegister();
  const { mutateAsync: loginMutation } = useLogin();

  useEffect(() => {
    const storedUser = localStorage.getItem("financeUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("financeUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      if (!email.includes('@') || !password) {
        throw new Error("Invalid email or password");
      }
      const result: any = await loginMutation({ email, password });
      const { token, user } = result.login;
      console.log("Login result:", result);
      setUser(user);
      localStorage.setItem("financeUser", JSON.stringify(user));
      localStorage.setItem("financeToken", token);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      if (!name || !email.includes('@') || !password || password.length < 6) {
        throw new Error("Invalid registration details");
      }

      const result : any = await registerMutation({ name, email, password });
      const { token, user } = result.register;
      setUser(user);
      localStorage.setItem("financeUser", JSON.stringify(user));
      localStorage.setItem("financeToken", token);
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.name}!`,
      });
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("financeUser");
    localStorage.removeItem("financeToken");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};