import { supabase } from "../lib/supabase";
import { LocalDb } from "../lib/localStorageDb";
import { Profile } from "../types";

export const profilesService = {
  async getProfile(): Promise<Profile> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return LocalDb.getProfile() as Profile;
        }
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code === "PGRST116") {
          const defaultProfile: Partial<Profile> = {
            user_id: user.id,
            name: user.email?.split("@")[0] || "Student",
            email: user.email || "",
            role_target: "Full-Stack Software Engineer",
            institution: "Acme University",
            graduation_year: "2026",
            bio: "Student exploring backend and front-end capabilities.",
            readiness_score: 50
          };
          const { data: created, error: createErr } = await supabase
            .from("profiles")
            .insert(defaultProfile)
            .select()
            .single();
          
          if (createErr) throw createErr;
          return created as Profile;
        } else if (error) {
          throw error;
        }
        return data as Profile;
      } catch (err) {
        console.warn("[SkillBridge Profiles] Supabase error, falling back to LocalDb:", err);
        return LocalDb.getProfile() as Profile;
      }
    } else {
      return LocalDb.getProfile() as Profile;
    }
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Authentication required");
        }

        const { data, error } = await supabase
          .from("profiles")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;
        return data as Profile;
      } catch (err) {
        console.warn("[SkillBridge Profiles] Supabase update error, falling back to LocalDb:", err);
        LocalDb.saveProfile(updates);
        return LocalDb.getProfile() as Profile;
      }
    } else {
      LocalDb.saveProfile(updates);
      return LocalDb.getProfile() as Profile;
    }
  },

  async recalculateReadinessScore(): Promise<number> {
    // Basic calculation based on completed skills and built projects
    const skills = supabase ? [] : LocalDb.getTable<any>("skills");
    const projects = supabase ? [] : LocalDb.getTable<any>("projects");
    
    // Simple heuristic
    let score = 40; // Base score
    
    const completedSkills = skills.filter(s => s.progress >= 80).length;
    score += completedSkills * 6; // +6 points per completed skill
    
    const completedProjects = projects.filter(p => p.status === "Completed").length;
    score += completedProjects * 12; // +12 points per built project
    
    // Cap at 95 unless they have resume scanned
    if (score > 95) score = 95;
    
    await this.updateProfile({ readiness_score: score });
    return score;
  }
};
