import { supabase } from "../lib/supabase";
import { LocalDb } from "../lib/localStorageDb";
import { Goal, Certificate } from "../types";

export const analyticsService = {
  // Goal CRUD
  async getGoals(): Promise<Goal[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("goals")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) throw error;
        return data as Goal[];
      } catch (err) {
        console.warn("[SkillBridge Analytics] Supabase error, falling back to LocalDb:", err);
        return LocalDb.getTable<Goal>("goals");
      }
    } else {
      return LocalDb.getTable<Goal>("goals");
    }
  },

  async addGoal(name: string): Promise<Goal> {
    const payload = {
      name,
      completed: false,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("goals")
          .insert({ ...payload, user_id: user?.id })
          .select()
          .single();
        if (error) throw error;
        return data as Goal;
      } catch (err) {
        console.warn("[SkillBridge Analytics] Supabase error on add goal, falling back to LocalDb:", err);
        return LocalDb.insert<Goal>("goals", payload);
      }
    } else {
      return LocalDb.insert<Goal>("goals", payload);
    }
  },

  async toggleGoal(id: string, completed: boolean): Promise<Goal> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("goals")
          .update({ completed })
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data as Goal;
      } catch (err) {
        console.warn("[SkillBridge Analytics] Supabase error on toggle goal, falling back to LocalDb:", err);
        const updated = LocalDb.update<Goal>("goals", id, { completed });
        if (!updated) throw new Error("Goal not found");
        return updated;
      }
    } else {
      const updated = LocalDb.update<Goal>("goals", id, { completed });
      if (!updated) throw new Error("Goal not found");
      return updated;
    }
  },

  async deleteGoal(id: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("goals")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.warn("[SkillBridge Analytics] Supabase error on delete goal, falling back to LocalDb:", err);
        return LocalDb.delete("goals", id);
      }
    } else {
      return LocalDb.delete("goals", id);
    }
  },

  // Certificates CRUD
  async getCertificates(): Promise<Certificate[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("certificates")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data as Certificate[];
      } catch (err) {
        console.warn("[SkillBridge Analytics] Supabase error, falling back to LocalDb:", err);
        return LocalDb.getTable<Certificate>("certificates");
      }
    } else {
      return LocalDb.getTable<Certificate>("certificates");
    }
  },

  async addCertificate(certificate: Omit<Certificate, "id" | "created_at" | "user_id">): Promise<Certificate> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("certificates")
          .insert({ ...certificate, user_id: user?.id, created_at: new Date().toISOString() })
          .select()
          .single();
        if (error) throw error;
        return data as Certificate;
      } catch (err) {
        console.warn("[SkillBridge Analytics] Supabase error on add cert, falling back to LocalDb:", err);
        return LocalDb.insert<Certificate>("certificates", certificate);
      }
    } else {
      return LocalDb.insert<Certificate>("certificates", certificate);
    }
  },

  async deleteCertificate(id: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("certificates")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.warn("[SkillBridge Analytics] Supabase error on delete cert, falling back to LocalDb:", err);
        return LocalDb.delete("certificates", id);
      }
    } else {
      return LocalDb.delete("certificates", id);
    }
  },

  // History for charts
  async getAnalyticsHistory(): Promise<{ date: string; value: number }[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("analytics")
          .select("date, value")
          .order("created_at", { ascending: true });
        if (error) throw error;
        return data as { date: string; value: number }[];
      } catch (err) {
        console.warn("[SkillBridge Analytics] Supabase error, falling back to LocalDb:", err);
        return LocalDb.getTable<{ date: string; value: number }>("analytics");
      }
    } else {
      return LocalDb.getTable<{ date: string; value: number }>("analytics");
    }
  },

  async recordAnalyticsPoint(value: number): Promise<any> {
    const payload = {
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("analytics")
          .insert({ ...payload, user_id: user?.id });
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("[SkillBridge Analytics] Supabase error on record analytics, falling back to LocalDb:", err);
        return LocalDb.insert("analytics", payload);
      }
    } else {
      return LocalDb.insert("analytics", payload);
    }
  }
};
