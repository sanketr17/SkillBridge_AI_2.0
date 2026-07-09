import { supabase } from "../lib/supabase";
import { LocalDb } from "../lib/localStorageDb";
import { Roadmap } from "../types";

export const roadmapsService = {
  async getRoadmaps(): Promise<Roadmap[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("roadmaps")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data as Roadmap[];
      } catch (err) {
        console.warn("[SkillBridge Roadmaps] Supabase error, falling back to LocalDb:", err);
        return LocalDb.getTable<Roadmap>("roadmaps");
      }
    } else {
      return LocalDb.getTable<Roadmap>("roadmaps");
    }
  },

  async addRoadmap(roadmap: Omit<Roadmap, "id" | "created_at" | "updated_at" | "user_id">): Promise<Roadmap> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const payload = {
          ...roadmap,
          user_id: user?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const { data, error } = await supabase
          .from("roadmaps")
          .insert(payload)
          .select()
          .single();
        
        if (error) throw error;
        return data as Roadmap;
      } catch (err) {
        console.warn("[SkillBridge Roadmaps] Supabase error on add, falling back to LocalDb:", err);
        return LocalDb.insert<Roadmap>("roadmaps", roadmap);
      }
    } else {
      return LocalDb.insert<Roadmap>("roadmaps", roadmap);
    }
  },

  async deleteRoadmap(id: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("roadmaps")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        return true;
      } catch (err) {
        console.warn("[SkillBridge Roadmaps] Supabase error on delete, falling back to LocalDb:", err);
        return LocalDb.delete("roadmaps", id);
      }
    } else {
      return LocalDb.delete("roadmaps", id);
    }
  },

  async updateRoadmapProgress(id: string, progress: number): Promise<Roadmap> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("roadmaps")
          .update({ progress, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data as Roadmap;
      } catch (err) {
        console.warn("[SkillBridge Roadmaps] Supabase error on update, falling back to LocalDb:", err);
        const updated = LocalDb.update<Roadmap>("roadmaps", id, { progress });
        if (!updated) throw new Error("Roadmap not found");
        return updated;
      }
    } else {
      const updated = LocalDb.update<Roadmap>("roadmaps", id, { progress });
      if (!updated) throw new Error("Roadmap not found");
      return updated;
    }
  }
};
