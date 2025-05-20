import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase-client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
  signInWithCredentials: (email: string, password: string) => Promise<string | null>;
  signUpWithCredentials: (email: string, password: string, displayName: string) => Promise<string | null>;
  refreshUser: () => Promise<User | null>; 
  resetPassword: (email: string) => Promise<string | null>;
  updatePassword: (newPassword: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = () => {
    supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithCredentials = async (
    email: string,
    password: string
  ): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message || null;
  };

  const signUpWithCredentials = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    return error?.message || null;
  };

  const refreshUser = async (): Promise<User | null> => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const access_token = sessionData?.session?.access_token;
  
    if (!access_token) {
      console.warn("No access token found, user not authenticated.");
      return null;
    }
  
    const { data: userData, error: userError } = await supabase.auth.getUser();
  
    if (userError || !userData.user) {
      console.warn("Failed to fetch user:", userError?.message);
      return null;
    }
  
    setUser(userData.user);
    return userData.user;
  };
  
  const resetPassword = async (email: string): Promise<string | null> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
  
    return error?.message || null;
  };

  const updatePassword = async (newPassword: string): Promise<string | null> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return error?.message || null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOut,
        signInWithCredentials,
        signUpWithCredentials,
        refreshUser, 
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return context;
};
