import React, { useState } from "react";
import { FolderGit2, Plus, Edit2, Trash2, Github, ExternalLink, Sparkles, CheckCircle } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { useToast } from "../hooks/useToast";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import { Project } from "../types";

export const ProjectsPage: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, loading } = useDashboard();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologiesInput, setTechnologiesInput] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [status, setStatus] = useState<"Idea" | "In Progress" | "Completed" | "Archived">("In Progress");
  const [formLoading, setFormLoading] = useState(false);

  const openAddModal = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setTechnologiesInput("");
    setGithubLink("");
    setLiveLink("");
    setStatus("In Progress");
    setModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setDescription(proj.description || "");
    setTechnologiesInput(proj.technologies ? proj.technologies.join(", ") : "");
    setGithubLink(proj.github_link || "");
    setLiveLink(proj.live_link || "");
    setStatus(proj.status);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in the project title and description.");
      return;
    }

    setFormLoading(true);
    try {
      const techArray = technologiesInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        technologies: techArray,
        github_link: githubLink.trim() || "",
        live_link: liveLink.trim() || "",
        status,
        images: []
      };

      if (editingProject) {
        await updateProject(editingProject.id, payload);
        toast.success("Project updated in your portfolio catalog.");
      } else {
        await addProject(payload);
        toast.success("Production-grade project registered! Readiness points accrued. 🚀");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to catalog project.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this project from your academic-industry portfolio?")) {
      try {
        await deleteProject(id);
        toast.success("Project deleted.");
      } catch (err) {
        toast.error("Failed to delete project.");
      }
    }
  };

  const getStatusBadge = (stat: "Idea" | "In Progress" | "Completed" | "Archived") => {
    switch (stat) {
      case "Idea":
        return "bg-slate-900 text-slate-400 border-white/5";
      case "In Progress":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse";
      case "Completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Archived":
        return "bg-slate-800 text-slate-500 border-white/5";
    }
  };

  return (
    <div className="space-y-8 select-none text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/15 text-[10px] text-purple-300 font-mono font-bold uppercase tracking-wider mb-2">
            Portfolio builder
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
            <FolderGit2 className="h-6 w-6 text-purple-400" /> SaaS Project Portfolio
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Publish your practical software engineering projects. Connect source repository nodes to earn industrial credit and boost your score.
          </p>
        </div>
        <Button variant="secondary" onClick={openAddModal} className="font-semibold shadow-[0_4px_20px_rgba(168,85,247,0.15)]">
          <Plus className="h-4 w-4 mr-1.5" /> Register New Project
        </Button>
      </div>

      {/* Grid list of projects */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-white/5 rounded-2xl" />
            <div className="h-48 bg-white/5 rounded-2xl" />
          </div>
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No Projects Cataloged"
          description="Build full-stack applications or design API structures. Registering projects provides the single largest boost to your placement readiness rating."
          actionLabel="Register Project"
          onAction={openAddModal}
          icon={<FolderGit2 className="h-6 w-6" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="premium-card hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group relative hover:-translate-y-1"
            >
              {/* Highlight ribbon for completed */}
              {proj.status === "Completed" && (
                <div className="absolute top-0 right-12 h-1.5 w-16 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-b-full shadow-md" />
              )}

              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider border px-2.5 py-1 rounded-full ${getStatusBadge(proj.status)}`}>
                    {proj.status}
                  </span>
                  
                  {/* Actions */}
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => openEditModal(proj)}
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/10 border border-white/5 text-slate-400 hover:text-purple-400 cursor-pointer transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-red-500/10 border border-white/5 text-slate-400 hover:text-red-400 cursor-pointer transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight mb-2 font-sans group-hover:text-purple-400 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-5 font-sans">
                  {proj.description}
                </p>

                {/* Tech Badges */}
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono font-bold uppercase tracking-wide bg-white/[0.02] text-slate-400 border border-white/5 px-2.5 py-1 rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Links Row */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                <div className="flex gap-4">
                  {proj.github_link && (
                    <a
                      href={proj.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      <Github className="h-4 w-4 text-slate-500" />
                      <span className="font-medium">Repository</span>
                    </a>
                  )}
                  {proj.live_link && (
                    <a
                      href={proj.live_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 text-slate-500" />
                      <span className="font-medium">Live Server</span>
                    </a>
                  )}
                </div>

                {proj.status === "Completed" && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400">
                    <CheckCircle className="h-3.5 w-3.5" /> Approved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Modal Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? "Modify Project Entry" : "Register New Academic-Industry Project"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-slate-200">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 shadow-inner"
              placeholder="e.g. SkillBridge AI Learning Hub"
              required
              maxLength={60}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Project Abstract / Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px] bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 shadow-inner"
              placeholder="Provide a functional abstract explaining why you built this, key problems solved, and architecture decisions..."
              required
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Technology Stack (Comma separated)
            </label>
            <input
              type="text"
              value={technologiesInput}
              onChange={(e) => setTechnologiesInput(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 shadow-inner"
              placeholder="React, TypeScript, Supabase, Express, Docker"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 shadow-inner"
                placeholder="https://github.com/yourusername/app"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
                Live Server URL
              </label>
              <input
                type="url"
                value={liveLink}
                onChange={(e) => setLiveLink(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 shadow-inner"
                placeholder="https://myproject.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Development Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-[#050811]/60 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
            >
              <option value="Idea">Idea Draft</option>
              <option value="In Progress">In Progress / Designing</option>
              <option value="Completed">Completed / Production Ready</option>
            </select>
          </div>

          <div className="pt-5 flex justify-end gap-3 border-t border-white/5 mt-6">
            <Button variant="secondary" size="sm" type="button" onClick={() => setModalOpen(false)} className="font-semibold">
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={formLoading} className="font-semibold shadow-[0_4px_20px_rgba(168,85,247,0.2)]">
              Save Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
