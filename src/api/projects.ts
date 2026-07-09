import { supabase } from "../lib/supabase";
import { LocalDb } from "../lib/localStorageDb";
import { Project } from "../types";
import { profilesService } from "./profiles";

export const projectsService = {
  async getProjects(): Promise<Project[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data as Project[];
      } catch (err) {
        console.warn("[SkillBridge Projects] Supabase error, falling back to LocalDb:", err);
        return LocalDb.getTable<Project>("projects");
      }
    } else {
      return LocalDb.getTable<Project>("projects");
    }
  },

  async addProject(project: Omit<Project, "id" | "created_at" | "updated_at" | "user_id">): Promise<Project> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const payload = {
          ...project,
          user_id: user?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const { data, error } = await supabase
          .from("projects")
          .insert(payload)
          .select()
          .single();
        
        if (error) throw error;
        await profilesService.recalculateReadinessScore();
        return data as Project;
      } catch (err) {
        console.warn("[SkillBridge Projects] Supabase error on add, falling back to LocalDb:", err);
        const created = LocalDb.insert<Project>("projects", project);
        await profilesService.recalculateReadinessScore();
        return created;
      }
    } else {
      const created = LocalDb.insert<Project>("projects", project);
      await profilesService.recalculateReadinessScore();
      return created;
    }
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("projects")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        await profilesService.recalculateReadinessScore();
        return data as Project;
      } catch (err) {
        console.warn("[SkillBridge Projects] Supabase error on update, falling back to LocalDb:", err);
        const updated = LocalDb.update<Project>("projects", id, updates);
        if (!updated) throw new Error("Project not found");
        await profilesService.recalculateReadinessScore();
        return updated;
      }
    } else {
      const updated = LocalDb.update<Project>("projects", id, updates);
      if (!updated) throw new Error("Project not found");
      await profilesService.recalculateReadinessScore();
      return updated;
    }
  },

  async deleteProject(id: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("projects")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        await profilesService.recalculateReadinessScore();
        return true;
      } catch (err) {
        console.warn("[SkillBridge Projects] Supabase error on delete, falling back to LocalDb:", err);
        const deleted = LocalDb.delete("projects", id);
        await profilesService.recalculateReadinessScore();
        return deleted;
      }
    } else {
      const deleted = LocalDb.delete("projects", id);
      await profilesService.recalculateReadinessScore();
      return deleted;
    }
  }
};
