import { supabase } from "../lib/supabase";
import { LocalDb } from "../lib/localStorageDb";
import { Skill } from "../types";
import { profilesService } from "./profiles";

export const skillsService = {
  async getSkills(): Promise<Skill[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("skills")
          .select("*")
          .order("progress", { ascending: false });
        
        if (error) throw error;
        return data as Skill[];
      } catch (err) {
        console.warn("[SkillBridge Skills] Supabase error, falling back to LocalDb:", err);
        return LocalDb.getTable<Skill>("skills");
      }
    } else {
      return LocalDb.getTable<Skill>("skills");
    }
  },

  async addSkill(skill: Omit<Skill, "id" | "created_at" | "updated_at" | "user_id">): Promise<Skill> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const payload = {
          ...skill,
          user_id: user?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const { data, error } = await supabase
          .from("skills")
          .insert(payload)
          .select()
          .single();
        
        if (error) throw error;
        await profilesService.recalculateReadinessScore();
        return data as Skill;
      } catch (err) {
        console.warn("[SkillBridge Skills] Supabase error on add, falling back to LocalDb:", err);
        const created = LocalDb.insert<Skill>("skills", skill);
        await profilesService.recalculateReadinessScore();
        return created;
      }
    } else {
      const created = LocalDb.insert<Skill>("skills", skill);
      await profilesService.recalculateReadinessScore();
      return created;
    }
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("skills")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        await profilesService.recalculateReadinessScore();
        return data as Skill;
      } catch (err) {
        console.warn("[SkillBridge Skills] Supabase error on update, falling back to LocalDb:", err);
        const updated = LocalDb.update<Skill>("skills", id, updates);
        if (!updated) throw new Error("Skill not found");
        await profilesService.recalculateReadinessScore();
        return updated;
      }
    } else {
      const updated = LocalDb.update<Skill>("skills", id, updates);
      if (!updated) throw new Error("Skill not found");
      await profilesService.recalculateReadinessScore();
      return updated;
    }
  },

  async deleteSkill(id: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("skills")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        await profilesService.recalculateReadinessScore();
        return true;
      } catch (err) {
        console.warn("[SkillBridge Skills] Supabase error on delete, falling back to LocalDb:", err);
        const deleted = LocalDb.delete("skills", id);
        await profilesService.recalculateReadinessScore();
        return deleted;
      }
    } else {
      const deleted = LocalDb.delete("skills", id);
      await profilesService.recalculateReadinessScore();
      return deleted;
    }
  }
};
