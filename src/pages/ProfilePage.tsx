import React, { useState } from "react";
import { User, Mail, GraduationCap, Target, Calendar, BookOpen, Edit2, CheckCircle, Trophy } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { profilesService } from "../api/profiles";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";

export const ProfilePage: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [roleTarget, setRoleTarget] = useState("");
  const [institution, setInstitution] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [bio, setBio] = useState("");

  const handleOpenEdit = () => {
    if (!profile) return;
    setName(profile.name);
    setRoleTarget(profile.role_target);
    setInstitution(profile.institution || "");
    setGraduationYear(profile.graduation_year || "");
    setBio(profile.bio || "");
    setModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roleTarget.trim()) {
      toast.error("Please fill in your name and target career position.");
      return;
    }

    setFormLoading(true);
    try {
      await profilesService.updateProfile({
        name: name.trim(),
        role_target: roleTarget.trim(),
        institution: institution.trim() || undefined,
        graduation_year: graduationYear.trim() || undefined,
        bio: bio.trim() || undefined
      });

      toast.success("Academic Profile updated successfully!");
      await refreshProfile();
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setFormLoading(false);
    }
  };

  if (!profile) {
    return <div className="text-slate-400 py-12 text-center font-sans">Loading student records...</div>;
  }

  return (
    <div className="space-y-8 select-none text-left">
      {/* Visual Header Banner */}
      <div className="premium-card p-6 sm:p-8 rounded-2xl overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative group">
        {/* Background gradient beams */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute left-1/3 top-0 w-64 h-64 bg-purple-500/5 rounded-full filter blur-[80px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 text-left">
          {/* Avatar circle */}
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[2px] shadow-lg shrink-0">
            <div className="h-full w-full rounded-full bg-[#03060e] flex items-center justify-center font-bold text-white text-3xl">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1.5">
            <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2 font-display">
              {profile.name} <CheckCircle className="h-5 w-5 text-indigo-400" />
            </h2>
            <p className="text-xs text-indigo-400 font-bold font-mono uppercase tracking-wider">{profile.role_target}</p>
            <p className="text-xs text-slate-400 font-sans flex items-center justify-center sm:justify-start gap-1.5 mt-1">
              <GraduationCap className="h-4 w-4 text-slate-500" /> {profile.institution || "Acme University"} &bull; Class of {profile.graduation_year || "2026"}
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleOpenEdit} className="relative z-10 shrink-0 font-semibold cursor-pointer">
          <Edit2 className="h-4 w-4 mr-1.5" /> Edit Profile Details
        </Button>
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bio summary card */}
        <div className="lg:col-span-2 premium-card rounded-2xl p-6 space-y-4">
          <h3 className="text-[10px] font-bold uppercase font-mono tracking-widest text-slate-500 border-b border-white/5 pb-2.5">
            Professional Abstract
          </h3>
          <p className="text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line text-left">
            {profile.bio || "No professional abstract cataloged yet. Tap 'Edit Profile Details' to customize your bio."}
          </p>
        </div>

        {/* Index audit score */}
        <div className="premium-card rounded-2xl p-6 flex flex-col justify-between items-center text-center">
          <h3 className="text-[10px] font-bold uppercase font-mono tracking-widest text-slate-500 border-b border-white/5 pb-2.5 w-full">
            Placements Scorecard
          </h3>
          <div className="my-6">
            <div className="h-28 w-28 rounded-full border-4 border-indigo-500/20 flex flex-col items-center justify-center bg-indigo-500/[0.02] relative shadow-2xl">
              <Trophy className="h-5 w-5 text-indigo-400 absolute top-3" />
              <span className="text-3xl font-extrabold text-white font-mono mt-4">
                {profile.readiness_score}%
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            Ready for industrial deployment
          </span>
        </div>
      </div>

      {/* Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Profile Details"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 text-slate-200">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
              required
              disabled={formLoading}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Target Career Role
            </label>
            <input
              type="text"
              value={roleTarget}
              onChange={(e) => setRoleTarget(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
              required
              disabled={formLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
                University / Institution
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
                placeholder="e.g. Stanford University"
                disabled={formLoading}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
                Graduation Year
              </label>
              <input
                type="text"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
                placeholder="e.g. 2026"
                disabled={formLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Professional Abstract / Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full min-h-[100px] bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
              placeholder="Provide a short overview describing your software engineering aspirations, target stacks, and academic credentials..."
              disabled={formLoading}
            />
          </div>

          <div className="pt-5 flex justify-end gap-3 border-t border-white/5 mt-6">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={formLoading}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={formLoading}
              className="font-semibold shadow-[0_4px_20px_rgba(99,102,241,0.25)]"
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
