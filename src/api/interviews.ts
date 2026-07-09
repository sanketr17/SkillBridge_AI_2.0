import { supabase } from "../lib/supabase";
import { LocalDb } from "../lib/localStorageDb";
import { InterviewPrep } from "../types";

export const interviewsService = {
  async getInterviews(): Promise<InterviewPrep[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("interviews")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data as InterviewPrep[];
      } catch (err) {
        console.warn("[SkillBridge Interviews] Supabase error, falling back to LocalDb:", err);
        return LocalDb.getTable<InterviewPrep>("interviews");
      }
    } else {
      return LocalDb.getTable<InterviewPrep>("interviews");
    }
  },

  async addInterview(interview: Omit<InterviewPrep, "id" | "created_at" | "updated_at" | "user_id">): Promise<InterviewPrep> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const payload = {
          ...interview,
          user_id: user?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const { data, error } = await supabase
          .from("interviews")
          .insert(payload)
          .select()
          .single();
        
        if (error) throw error;
        return data as InterviewPrep;
      } catch (err) {
        console.warn("[SkillBridge Interviews] Supabase error on add, falling back to LocalDb:", err);
        return LocalDb.insert<InterviewPrep>("interviews", interview);
      }
    } else {
      return LocalDb.insert<InterviewPrep>("interviews", interview);
    }
  },

  async saveInterviewResult(id: string, score: number, answers: Record<string, string>, feedback: string): Promise<InterviewPrep> {
    const updates = {
      score,
      answers,
      feedback,
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("interviews")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data as InterviewPrep;
      } catch (err) {
        console.warn("[SkillBridge Interviews] Supabase error on save result, falling back to LocalDb:", err);
        const updated = LocalDb.update<InterviewPrep>("interviews", id, updates);
        if (!updated) throw new Error("Interview screening not found");
        return updated;
      }
    } else {
      const updated = LocalDb.update<InterviewPrep>("interviews", id, updates);
      if (!updated) throw new Error("Interview screening not found");
      return updated;
    }
  },

  async deleteInterview(id: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("interviews")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        return true;
      } catch (err) {
        console.warn("[SkillBridge Interviews] Supabase error on delete, falling back to LocalDb:", err);
        return LocalDb.delete("interviews", id);
      }
    } else {
      return LocalDb.delete("interviews", id);
    }
  }
};
