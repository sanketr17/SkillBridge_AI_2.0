import React, { useState } from "react";
import { Map, Sparkles, Plus, Calendar, Compass, CheckCircle2, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { useToast } from "../hooks/useToast";
import { aiService } from "../api/ai";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import { Roadmap, RoadmapWeek } from "../types";

export const RoadmapPage: React.FC = () => {
  const { roadmaps, addRoadmap, updateRoadmapProgress, deleteRoadmap, loading } = useDashboard();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [expandedRoadmapId, setExpandedRoadmapId] = useState<string | null>(null);

  // Form States
  const [role, setRole] = useState("Full-Stack Software Engineer");
  const [techKeywords, setTechKeywords] = useState("React, Node.js, PostgreSQL");
  const [weeks, setWeeks] = useState(4);
  const [generationLoading, setGenerationLoading] = useState(false);

  // Helper to toggle step completion
  const [completedStepsState, setCompletedStepsState] = useState<Record<string, Record<number, boolean>>>({});

  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      toast.error("Please provide a target role.");
      return;
    }

    setGenerationLoading(true);
    toast.info("Connecting to Gemini AI Engine. Modeling study paths...");
    try {
      // Connect to server-side endpoint
      const prompt = `A ${weeks}-week learning roadmap for the role of ${role.trim()} focusing on ${techKeywords.trim()}.`;
      const response = await aiService.generateRoadmap(prompt);

      // Add to database/local storage
      const added = await addRoadmap({
        title: response.title || `${weeks}-Week ${role} Roadmap`,
        tagline: response.tagline || `Your personalized path to mastering ${role}.`,
        estimatedDuration: `${weeks} Weeks`,
        weeks: response.weeks || [],
        recommendedProjects: response.recommendedProjects || [],
        progress: 0
      });

      toast.success("AI Roadmap engineered! Study tracks loaded successfully.");
      setExpandedRoadmapId(added.id);
      setModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate AI roadmap. Falling back to structured simulation.");
      
      // Seed a robust simulation backup if API call triggers a timeout
      const fallbackWeeks: RoadmapWeek[] = Array.from({ length: weeks }).map((_, idx) => ({
        weekNumber: idx + 1,
        focus: `Core Competencies Week ${idx + 1}`,
        practicalTask: `Initialize a secure boilerplate project with localized environment structures for ${role}.`,
        topics: ["System Design", "Integration Testing", "Deployment Pipelines"],
        resources: ["Official Documentation", "SkillBridge Sandbox QuickStart"]
      }));

      await addRoadmap({
        title: `${weeks}-Week ${role} study Track`,
        tagline: `Accelerate placement metrics for ${role}.`,
        estimatedDuration: `${weeks} Weeks`,
        weeks: fallbackWeeks,
        recommendedProjects: [
          {
            name: "Industrial Core Sandbox",
            description: "An advanced sandbox demonstrating complete full-stack flows.",
            technologies: ["React", "Express", "Supabase"]
          }
        ],
        progress: 0
      });
      toast.success("Structured roadmap loaded successfully.");
      setModalOpen(false);
    } finally {
      setGenerationLoading(false);
    }
  };

  const isStepCompleted = (roadmapId: string, weekIndex: number) => {
    return !!completedStepsState[roadmapId]?.[weekIndex];
  };

  const handleToggleStep = async (roadmapId: string, weekIndex: number) => {
    const roadmap = roadmaps.find(r => r.id === roadmapId);
    if (!roadmap || !roadmap.weeks) return;

    try {
      const isCurrentlyCompleted = isStepCompleted(roadmapId, weekIndex);
      
      const roadmapStepsState = completedStepsState[roadmapId] || {};
      const updatedStepsState = {
        ...roadmapStepsState,
        [weekIndex]: !isCurrentlyCompleted
      };

      setCompletedStepsState(prev => ({
        ...prev,
        [roadmapId]: updatedStepsState
      }));

      // Recalculate progress percentage
      const completedCount = Object.values(updatedStepsState).filter(Boolean).length;
      const calculatedProgress = Math.round((completedCount / roadmap.weeks.length) * 100);

      // Update in local DB or Supabase
      await updateRoadmapProgress(roadmapId, calculatedProgress);
      
      toast.success(`Week ${weekIndex + 1} checkpoint updated!`);
    } catch (err) {
      toast.error("Failed to update task step.");
    }
  };

  const handleDeleteRoadmap = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to discard this study roadmap?")) {
      try {
        await deleteRoadmap(id);
        toast.success("Roadmap discarded.");
        if (expandedRoadmapId === id) setExpandedRoadmapId(null);
      } catch (err) {
        toast.error("Failed to delete roadmap.");
      }
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedRoadmapId(expandedRoadmapId === id ? null : id);
  };

  return (
    <div className="space-y-8 select-none text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-[10px] text-emerald-300 font-mono font-bold uppercase tracking-wider mb-2">
            AI learning paths
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
            <Map className="h-6 w-6 text-emerald-400" /> Personalized Learning Roadmaps
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Engineered study pathways custom tailored to help you transition from textbook theory to full-scale enterprise software engineering.
          </p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)} className="bg-emerald-500 hover:bg-emerald-450 shadow-[0_4px_20px_rgba(16,185,129,0.25)] font-semibold border-emerald-400/25">
          <Sparkles className="h-4 w-4 mr-1.5" /> Engineer AI Roadmap
        </Button>
      </div>

      {/* Roadmaps List Container */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-white/5 rounded-2xl" />
          <div className="h-24 bg-white/5 rounded-2xl" />
        </div>
      ) : roadmaps.length === 0 ? (
        <EmptyState
          title="No Learning Pathways Generated"
          description="Type in your target role and the tools you want to master. Our AI will construct a custom weekly timeline of objectives, study topics, and practical projects."
          actionLabel="Construct Roadmap"
          onAction={() => setModalOpen(true)}
          icon={<Compass className="h-6 w-6 text-emerald-400" />}
        />
      ) : (
        <div className="space-y-4">
          {roadmaps.map((roadmap) => {
            const isExpanded = expandedRoadmapId === roadmap.id;
            return (
              <div
                key={roadmap.id}
                className="premium-card rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => toggleExpand(roadmap.id)}
              >
                {/* Header Row */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.01]">
                  <div className="flex items-start gap-4 text-left">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-sans tracking-tight">{roadmap.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 font-sans">
                        Target Position: <span className="text-emerald-400 font-semibold">{roadmap.weeks[0]?.focus || "Study Node"}</span> &bull; Duration: {roadmap.weeks.length} Weeks
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between sm:justify-end w-full sm:w-auto">
                    {/* Progress micro display */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 font-mono">{roadmap.progress}% Completed</span>
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${roadmap.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleDeleteRoadmap(roadmap.id, e)}
                        className="p-2 rounded-xl bg-white/[0.02] hover:bg-red-500/10 text-slate-500 hover:text-red-400 border border-transparent hover:border-red-500/10 transition-all cursor-pointer"
                        title="Delete Roadmap"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="text-slate-400 p-2">
                        {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-300" /> : <ChevronDown className="h-5 w-5 text-slate-300" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub Weekly Checklist Steps */}
                {isExpanded && roadmap.weeks && (
                  <div className="border-t border-white/5 p-6 bg-black/25 space-y-4 text-left">
                    <h4 className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-widest mb-3">
                      Weekly Learning Checkpoints
                    </h4>
                    <div className="space-y-3">
                      {roadmap.weeks.map((step, idx) => {
                        const stepCompleted = isStepCompleted(roadmap.id, idx);
                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-xl border transition-all duration-300 ${
                              stepCompleted
                                ? "bg-white/[0.01] border-white/5 opacity-60"
                                : "bg-white/[0.02] border-white/10"
                            }`}
                            onClick={(e) => e.stopPropagation()} // Stop bubbling
                          >
                            <div className="flex items-start gap-3.5">
                              <input
                                type="checkbox"
                                checked={stepCompleted}
                                onChange={() => handleToggleStep(roadmap.id, idx)}
                                className="mt-1 rounded border-white/10 bg-black/40 text-emerald-500 focus:ring-0 focus:ring-offset-0 h-4.5 w-4.5 cursor-pointer"
                              />
                              <div className="flex-1 space-y-2 text-left">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-bold font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                                    Week {step.weekNumber}
                                  </span>
                                  <h5 className="text-xs font-bold text-white font-sans">{step.focus}</h5>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-sans">{step.practicalTask}</p>
                                
                                {/* Sub Topics list */}
                                {step.topics && step.topics.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 pt-2">
                                    {step.topics.map((topic, tIdx) => (
                                      <span
                                        key={tIdx}
                                        className="text-[9px] font-mono font-bold uppercase tracking-wider bg-black/40 text-slate-500 border border-white/5 px-2 py-0.5 rounded"
                                      >
                                        {topic}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Form Generation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="AI Learning Roadmap Engineer"
      >
        <form onSubmit={handleGenerateRoadmap} className="space-y-4 text-slate-200">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Target Position / Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 shadow-inner"
              placeholder="e.g. Next.js Developer, DevOps Architect"
              required
              disabled={generationLoading}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Technology Focus & Toolkits (Comma separated)
            </label>
            <input
              type="text"
              value={techKeywords}
              onChange={(e) => setTechKeywords(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 shadow-inner"
              placeholder="e.g. TailwindCSS, Supabase, Jest, AWS"
              required
              disabled={generationLoading}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Training Duration (Weeks)
            </label>
            <select
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="w-full bg-[#050811]/60 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
              disabled={generationLoading}
            >
              <option value={4}>4 Weeks (Accelerated Crash)</option>
              <option value={6}>6 Weeks (Moderate Focus)</option>
              <option value={8}>8 Weeks (Complete Training)</option>
              <option value={12}>12 Weeks (Comprehensive Architecture)</option>
            </select>
          </div>

          <div className="pt-5 flex justify-end gap-3 border-t border-white/5 mt-6">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={generationLoading}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={generationLoading}
              className="bg-emerald-500 hover:bg-emerald-450 border-emerald-400/20 font-semibold shadow-[0_4px_20px_rgba(16,185,129,0.25)]"
            >
              <Sparkles className="h-4 w-4 mr-1.5" /> Generate via Gemini AI
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoadmapPage;
