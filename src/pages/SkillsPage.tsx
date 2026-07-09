import React, { useState } from "react";
import { Plus, Edit2, Trash2, Filter, Award, Sparkles } from "lucide-react";
import { useSkills } from "../context/SkillContext";
import { useToast } from "../hooks/useToast";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import { Skill, SkillLevel } from "../types";

export const SkillsPage: React.FC = () => {
  const { skills, addSkill, updateSkill, deleteSkill, loading } = useSkills();
  const toast = useToast();

  const [activeFilter, setActiveFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [level, setLevel] = useState<SkillLevel>("Intermediate");
  const [progress, setProgress] = useState(50);
  const [category, setCategory] = useState("Frontend");
  const [formLoading, setFormLoading] = useState(false);

  const categories = ["Frontend", "Backend", "Database", "DevOps", "System Design", "Languages"];

  const openAddModal = () => {
    setEditingSkill(null);
    setName("");
    setLevel("Intermediate");
    setProgress(50);
    setCategory("Frontend");
    setModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setLevel(skill.level);
    setProgress(skill.progress);
    setCategory(skill.category);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a skill name.");
      return;
    }

    setFormLoading(true);
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, {
          name: name.trim(),
          level,
          progress: Number(progress),
          category
        });
        toast.success("Skill updated in your matrix.");
      } else {
        await addSkill({
          name: name.trim(),
          level,
          progress: Number(progress),
          category
        });
        toast.success("Skill cataloged securely.");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to catalog skill.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this skill competency from your matrix?")) {
      try {
        await deleteSkill(id);
        toast.success("Skill removed from matrix.");
      } catch (err) {
        toast.error("Failed to delete skill.");
      }
    }
  };

  const filteredSkills = activeFilter === "All"
    ? skills
    : skills.filter(s => s.category.toLowerCase() === activeFilter.toLowerCase());

  const getLevelColor = (lvl: SkillLevel) => {
    switch (lvl) {
      case "Beginner": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Intermediate": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Advanced": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "Expert": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    }
  };

  const uniqueCategoriesOnFile = ["All", ...Array.from(new Set(skills.map(s => s.category)))];

  return (
    <div className="space-y-8 select-none text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/15 text-[10px] text-indigo-300 font-mono font-bold uppercase tracking-wider mb-2">
            Skill Analytics
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
            <Award className="h-6 w-6 text-indigo-400" /> Industrial Skills Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Map out your academic knowledge to structured, industry-recognized development competencies.
          </p>
        </div>
        <Button variant="primary" onClick={openAddModal} className="font-semibold shadow-[0_4px_20px_rgba(99,102,241,0.25)]">
          <Plus className="h-4 w-4 mr-1.5" /> Catalog New Skill
        </Button>
      </div>

      {/* Filter Row */}
      {skills.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2.5 border-b border-white/5 scrollbar-thin">
          <Filter className="h-3.5 w-3.5 text-slate-500 shrink-0 mr-1" />
          {uniqueCategoriesOnFile.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition-all duration-300 border ${
                activeFilter === cat
                  ? "bg-white text-slate-950 border-white shadow-lg"
                  : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-white/5 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-40 bg-white/5 rounded-2xl" />
            <div className="h-40 bg-white/5 rounded-2xl" />
            <div className="h-40 bg-white/5 rounded-2xl" />
          </div>
        </div>
      ) : filteredSkills.length === 0 ? (
        <EmptyState
          title="No Skills Registered"
          description={
            activeFilter === "All"
              ? "Your industrial skill matrix is currently blank. Start cataloging skills to track progress!"
              : `No skills found in the category "${activeFilter}".`
          }
          actionLabel="Catalog Skill"
          onAction={openAddModal}
          icon={<Award className="h-6 w-6" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="premium-card hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group min-h-[160px] hover:-translate-y-1"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/5">
                    {skill.category}
                  </span>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => openEditModal(skill)}
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/10 border border-white/5 text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors"
                      title="Edit Skill"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-red-500/10 border border-white/5 text-slate-400 hover:text-red-400 cursor-pointer transition-colors"
                      title="Delete Skill"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight font-sans">{skill.name}</h3>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[10px] font-bold font-mono border px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getLevelColor(skill.level)}`}>
                    {skill.level}
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">{skill.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Modal Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSkill ? "Modify Skill Record" : "Catalog New Competency"}
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-slate-200">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Skill / Tool Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
              placeholder="e.g. Docker, TypeScript, Jest"
              required
              maxLength={50}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
                Category Domain
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#050811]/60 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
                Proficiency Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as SkillLevel)}
                className="w-full bg-[#050811]/60 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="Beginner">Beginner (Classroom)</option>
                <option value="Intermediate">Intermediate (Project)</option>
                <option value="Advanced">Advanced (SaaS-Ready)</option>
                <option value="Expert">Expert (Architecture)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">
                Progress Percentage
              </label>
              <span className="text-xs font-bold text-indigo-400 font-mono">{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="pt-5 flex justify-end gap-3 border-t border-white/5 mt-6">
            <Button variant="secondary" size="sm" type="button" onClick={() => setModalOpen(false)} className="font-semibold">
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={formLoading} className="font-semibold shadow-[0_4px_20px_rgba(99,102,241,0.25)]">
              Save Skill
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SkillsPage;
