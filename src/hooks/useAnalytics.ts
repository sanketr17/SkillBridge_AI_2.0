import { useEffect, useState } from "react";
import { analyticsService } from "../api/analytics";
import { useSkills } from "../context/SkillContext";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";

export const useAnalytics = () => {
  const { skills } = useSkills();
  const { projects, certificates, analyses } = useDashboard();
  const { profile } = useAuth();
  const [history, setHistory] = useState<{ date: string; value: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await analyticsService.getAnalyticsHistory();
        setHistory(data);
      } catch (err) {
        console.error("Error fetching analytics history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [skills, projects, profile]);

  // Calculations
  const totalSkills = skills.length;
  const completedSkills = skills.filter(s => s.progress >= 80).length;
  const averageSkillProgress = totalSkills > 0 
    ? Math.round(skills.reduce((acc, s) => acc + s.progress, 0) / totalSkills)
    : 0;

  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  const projectsInProgress = projects.filter(p => p.status === "In Progress").length;

  const totalCertificates = certificates.length;
  const totalAnalyses = analyses.length;

  const readinessScore = profile?.readiness_score || 40;

  // Pie chart data: Skills categories
  const skillsByCategory = skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const skillCategoryData = Object.entries(skillsByCategory).map(([name, value]) => ({
    name,
    value
  }));

  // Bar chart data: Skill Progress distribution
  const progressBuckets = [
    { name: "Beginner (<40%)", count: skills.filter(s => s.progress < 40).length },
    { name: "Intermediate (40-70%)", count: skills.filter(s => s.progress >= 40 && s.progress < 70).length },
    { name: "Advanced (70-90%)", count: skills.filter(s => s.progress >= 70 && s.progress < 90).length },
    { name: "Expert (>=90%)", count: skills.filter(s => s.progress >= 90).length }
  ];

  return {
    history,
    loading,
    stats: {
      totalSkills,
      completedSkills,
      averageSkillProgress,
      totalProjects,
      completedProjects,
      projectsInProgress,
      totalCertificates,
      totalAnalyses,
      readinessScore
    },
    charts: {
      skillCategoryData,
      progressBuckets
    }
  };
};

export default useAnalytics;
