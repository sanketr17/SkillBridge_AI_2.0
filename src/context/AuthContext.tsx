import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { LocalDb } from "../lib/localStorageDb";
import { Profile } from "../types";
import { profilesService } from "../api/profiles";

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const prof = await profilesService.getProfile();
      setProfile(prof);
    } catch (err) {
      console.error("Error fetching profile inside auth provider:", err);
    }
  };

  useEffect(() => {
    // Standard Supabase Session Tracking
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUser(session.user);
          fetchProfile();
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setUser(session.user);
          fetchProfile();
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Local storage auth simulation
      const sessionUser = localStorage.getItem("sb_session_user");
      if (sessionUser) {
        setUser(JSON.parse(sessionUser));
        fetchProfile();
      } else {
        // Automatically sign in a mock user if there is none, just to make onboarding flawless
        const mockUser = { id: "user-123", email: "sanketr980@gmail.com", user_metadata: { name: "Sanket R" } };
        localStorage.setItem("sb_session_user", JSON.stringify(mockUser));
        setUser(mockUser);
        fetchProfile();
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await fetchProfile();
      } else {
        // Simulate login
        const mockUser = { id: "user-123", email, user_metadata: { name: email.split("@")[0] } };
        localStorage.setItem("sb_session_user", JSON.stringify(mockUser));
        
        // Update local profile name and email
        LocalDb.saveProfile({ name: email.split("@")[0], email });
        
        setUser(mockUser);
        await fetchProfile();
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });
        if (error) throw error;
        
        // Create initial profile in Supabase
        if (data.user) {
          const { error: profileErr } = await supabase.from("profiles").insert({
            user_id: data.user.id,
            name,
            email,
            role_target: "Full-Stack Software Engineer",
            institution: "Acme University",
            graduation_year: "2026",
            bio: "Excited to study and build industrial applications on SkillBridge AI.",
            readiness_score: 40
          });
          if (profileErr) console.error("Initial profile insert error:", profileErr);
        }
      } else {
        // Simulate signup
        const mockUser = { id: `user-${Math.random().toString(36).substr(2, 9)}`, email, user_metadata: { name } };
        localStorage.setItem("sb_session_user", JSON.stringify(mockUser));
        
        // Save simulated profile
        LocalDb.saveProfile({
          id: mockUser.id,
          user_id: mockUser.id,
          name,
          email,
          role_target: "Full-Stack Software Engineer",
          institution: "Acme University",
          graduation_year: "2026",
          bio: "Excited to study and build industrial applications on SkillBridge AI.",
          readiness_score: 40
        });

        setUser(mockUser);
        await fetchProfile();
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } else {
        localStorage.removeItem("sb_session_user");
      }
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
    } else {
      console.log(`[Mock Auth] Password reset link simulated for ${email}`);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        login,
        signUp,
        signOut,
        resetPassword,
        refreshProfile
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
