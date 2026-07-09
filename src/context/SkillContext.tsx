import React, { createContext, useContext, useState, useEffect } from "react";
import { Skill } from "../types";
import { skillsService } from "../api/skills";
import { useAuth } from "./AuthContext";

interface SkillContextType {
  skills: Skill[];
  loading: boolean;
  refreshSkills: () => Promise<void>;
  addSkill: (skill: Omit<Skill, "id" | "created_at" | "updated_at" | "user_id">) => Promise<Skill>;
  updateSkill: (id: string, updates: Partial<Skill>) => Promise<Skill>;
  deleteSkill: (id: string) => Promise<void>;
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export const SkillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, refreshProfile } = useAuth();

  const refreshSkills = async () => {
    setLoading(true);
    try {
      const list = await skillsService.getSkills();
      setSkills(list);
    } catch (err) {
      console.error("Error loading skills in context:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshSkills();
    } else {
      setSkills([]);
      setLoading(false);
    }
  }, [user]);

  const addSkill = async (skill: Omit<Skill, "id" | "created_at" | "updated_at" | "user_id">) => {
    const created = await skillsService.addSkill(skill);
    setSkills(prev => [created, ...prev]);
    await refreshProfile();
    return created;
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    const updated = await skillsService.updateSkill(id, updates);
    setSkills(prev => prev.map(s => s.id === id ? updated : s));
    await refreshProfile();
    return updated;
  };

  const deleteSkill = async (id: string) => {
    await skillsService.deleteSkill(id);
    setSkills(prev => prev.filter(s => s.id !== id));
    await refreshProfile();
  };

  return (
    <SkillContext.Provider
      value={{
        skills,
        loading,
        refreshSkills,
        addSkill,
        updateSkill,
        deleteSkill
      }}
    >
      {children}
    </SkillContext.Provider>
  );
};

export const useSkills = () => {
  const context = useContext(SkillContext);
  if (context === undefined) {
    throw new Error("useSkills must be used within a SkillProvider");
  }
  return context;
};
