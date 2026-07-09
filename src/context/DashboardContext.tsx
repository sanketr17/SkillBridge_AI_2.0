import React, { createContext, useContext, useState, useEffect } from "react";
import { Project, Roadmap, Goal, Certificate, ResumeAnalysis, Notification } from "../types";
import { projectsService } from "../api/projects";
import { roadmapsService } from "../api/roadmaps";
import { analyticsService } from "../api/analytics";
import { visionService } from "../api/vision";
import { LocalDb } from "../lib/localStorageDb";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

interface DashboardContextType {
  projects: Project[];
  roadmaps: Roadmap[];
  goals: Goal[];
  certificates: Certificate[];
  analyses: ResumeAnalysis[];
  notifications: Notification[];
  loading: boolean;
  refreshAll: () => Promise<void>;
  
  // Projects
  addProject: (p: Omit<Project, "id" | "created_at" | "updated_at" | "user_id">) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;

  // Roadmaps
  addRoadmap: (r: Omit<Roadmap, "id" | "created_at" | "updated_at" | "user_id">) => Promise<Roadmap>;
  updateRoadmapProgress: (id: string, progress: number) => Promise<Roadmap>;
  deleteRoadmap: (id: string) => Promise<void>;

  // Goals
  addGoal: (name: string) => Promise<Goal>;
  toggleGoal: (id: string, completed: boolean) => Promise<Goal>;
  deleteGoal: (id: string) => Promise<void>;

  // Certificates
  addCertificate: (c: Omit<Certificate, "id" | "created_at" | "user_id">) => Promise<Certificate>;
  deleteCertificate: (id: string) => Promise<void>;

  // Resume Analyses
  addAnalysis: (a: ResumeAnalysis) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, refreshProfile } = useAuth();

  const refreshAll = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const [projs, rdms, gls, certs, anls] = await Promise.all([
        projectsService.getProjects(),
        roadmapsService.getRoadmaps(),
        analyticsService.getGoals(),
        analyticsService.getCertificates(),
        visionService.getAnalyses()
      ]);

      setProjects(projs);
      setRoadmaps(rdms);
      setGoals(gls);
      setCertificates(certs);
      setAnalyses(anls);
      
      // Load notifications
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .order("created_at", { ascending: false });
          if (error) throw error;
          setNotifications((data as Notification[]) || []);
        } catch (err) {
          console.warn("[SkillBridge Dashboard] Supabase error on notifications, falling back to LocalDb:", err);
          setNotifications(LocalDb.getTable<Notification>("notifications"));
        }
      } else {
        setNotifications(LocalDb.getTable<Notification>("notifications"));
      }
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, [user]);

  // Projects CRUD
  const addProject = async (p: Omit<Project, "id" | "created_at" | "updated_at" | "user_id">) => {
    const created = await projectsService.addProject(p);
    setProjects(prev => [created, ...prev]);
    await refreshProfile();
    return created;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const updated = await projectsService.updateProject(id, updates);
    setProjects(prev => prev.map(p => p.id === id ? updated : p));
    await refreshProfile();
    return updated;
  };

  const deleteProject = async (id: string) => {
    await projectsService.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
    await refreshProfile();
  };

  // Roadmaps CRUD
  const addRoadmap = async (r: Omit<Roadmap, "id" | "created_at" | "updated_at" | "user_id">) => {
    const created = await roadmapsService.addRoadmap(r);
    setRoadmaps(prev => [created, ...prev]);
    return created;
  };

  const updateRoadmapProgress = async (id: string, progress: number) => {
    const updated = await roadmapsService.updateRoadmapProgress(id, progress);
    setRoadmaps(prev => prev.map(r => r.id === id ? updated : r));
    return updated;
  };

  const deleteRoadmap = async (id: string) => {
    await roadmapsService.deleteRoadmap(id);
    setRoadmaps(prev => prev.filter(r => r.id !== id));
  };

  // Goals CRUD
  const addGoal = async (name: string) => {
    const created = await analyticsService.addGoal(name);
    setGoals(prev => [...prev, created]);
    return created;
  };

  const toggleGoal = async (id: string, completed: boolean) => {
    const updated = await analyticsService.toggleGoal(id, completed);
    setGoals(prev => prev.map(g => g.id === id ? updated : g));
    return updated;
  };

  const deleteGoal = async (id: string) => {
    await analyticsService.deleteGoal(id);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Certificates CRUD
  const addCertificate = async (c: Omit<Certificate, "id" | "created_at" | "user_id">) => {
    const created = await analyticsService.addCertificate(c);
    setCertificates(prev => [created, ...prev]);
    return created;
  };

  const deleteCertificate = async (id: string) => {
    await analyticsService.deleteCertificate(id);
    setCertificates(prev => prev.filter(c => c.id !== id));
  };

  const addAnalysis = (a: ResumeAnalysis) => {
    setAnalyses(prev => [a, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    if (supabase) {
      supabase.from("notifications").update({ read: true }).eq("id", id).then();
    } else {
      LocalDb.update("notifications", id, { read: true });
    }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <DashboardContext.Provider
      value={{
        projects,
        roadmaps,
        goals,
        certificates,
        analyses,
        notifications,
        loading,
        refreshAll,
        
        addProject,
        updateProject,
        deleteProject,

        addRoadmap,
        updateRoadmapProgress,
        deleteRoadmap,

        addGoal,
        toggleGoal,
        deleteGoal,

        addCertificate,
        deleteCertificate,

        addAnalysis,
        markNotificationRead
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
