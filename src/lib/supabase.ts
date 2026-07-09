import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

// Detect if Supabase is properly configured with real values rather than empty placeholders
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl !== "MY_SUPABASE_URL" && 
  supabaseUrl.trim() !== "" &&
  supabaseAnonKey && 
  supabaseAnonKey !== "MY_SUPABASE_ANON_KEY" &&
  supabaseAnonKey.trim() !== "";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (isSupabaseConfigured) {
  console.log("[SkillBridge Supabase] Connected securely to user's custom Supabase project.");
} else {
  console.log("[SkillBridge LocalMode] Supabase environment keys are not configured. Running in high-fidelity Local Storage Mode.");
}
