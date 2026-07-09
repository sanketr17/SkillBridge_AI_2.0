import React, { useState } from "react";
import { TrendingUp, Plus, Trash2, Award, Calendar, ExternalLink, Activity, PieChart, BarChart3, Star, Mail } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { useAnalytics } from "../hooks/useAnalytics";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../context/AuthContext";
import { emailService } from "../api/email";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import ProgressChart from "../components/charts/ProgressChart";
import SkillsChart from "../components/charts/SkillsChart";
import GrowthChart from "../components/charts/GrowthChart";

export const AnalyticsPage: React.FC = () => {
  const { certificates, addCertificate, deleteCertificate, loading: dbLoading } = useDashboard();
  const { stats, history, charts, loading: chartsLoading } = useAnalytics();
  const { user } = useAuth();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [url, setUrl] = useState("");

  const handleSendEmailReport = async () => {
    const recipientEmail = user?.email || "sanketr980@gmail.com";
    setSendingEmail(true);
    toast.info(`Dispatching your readiness report to ${recipientEmail}...`);

    try {
      const response = await emailService.sendAnalyticsReport(recipientEmail, {
        completedSkills: stats.completedSkills,
        averageSkillProgress: stats.averageSkillProgress,
        totalProjects: stats.totalProjects,
        totalCertificates: certificates.length
      });

      if (response && (response.success || response.mocked)) {
        toast.success(response.message || "Readiness report dispatched successfully!");
      } else {
        toast.error("Failed to dispatch report. Check development server log.");
      }
    } catch (err) {
      console.error("Email dispatch error:", err);
      toast.error("Failed to send readiness report.");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim()) {
      toast.error("Please enter a certificate title and issuer.");
      return;
    }

    setFormLoading(true);
    try {
      await addCertificate({
        title: title.trim(),
        issuer: issuer.trim(),
        credential_id: credentialId.trim() || undefined,
        url: url.trim() || undefined
      });
      toast.success("Certificate cataloged successfully!");
      setTitle("");
      setIssuer("");
      setCredentialId("");
      setUrl("");
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to catalog certificate.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this academic credential?")) {
      try {
        await deleteCertificate(id);
        toast.success("Credential removed.");
      } catch (err) {
        toast.error("Failed to remove credential.");
      }
    }
  };

  return (
    <div className="space-y-8 select-none text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/15 text-[10px] text-indigo-300 font-mono font-bold uppercase tracking-wider mb-2">
            Placement insights
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
            <TrendingUp className="h-6 w-6 text-indigo-400" /> Readiness Growth Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Deep-dive audits into your technological competencies, progress trends, and certified achievements.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={handleSendEmailReport}
            isLoading={sendingEmail}
            className="font-semibold border-white/10 hover:bg-white/5 text-slate-300"
          >
            <Mail className="h-4 w-4 mr-1.5 text-indigo-400" /> Email Report
          </Button>
          <Button variant="primary" onClick={() => setModalOpen(true)} className="font-semibold shadow-[0_4px_20px_rgba(99,102,241,0.25)]">
            <Plus className="h-4 w-4 mr-1.5" /> Catalog Certificate
          </Button>
        </div>
      </div>

      {/* Numerical Stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 premium-card p-6 rounded-2xl">
        <div className="text-center md:border-r border-white/5">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
            Completed Skills
          </span>
          <span className="text-3xl font-extrabold text-white block mt-1.5 font-sans">{stats.completedSkills}</span>
        </div>
        <div className="text-center md:border-r border-white/5">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
            Avg Skill Progress
          </span>
          <span className="text-3xl font-extrabold text-indigo-400 block mt-1.5 font-sans">{stats.averageSkillProgress}%</span>
        </div>
        <div className="text-center md:border-r border-white/5">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
            Built Repositories
          </span>
          <span className="text-3xl font-extrabold text-purple-400 block mt-1.5 font-sans">{stats.totalProjects}</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
            Approved Certificates
          </span>
          <span className="text-3xl font-extrabold text-cyan-400 block mt-1.5 font-sans">{certificates.length}</span>
        </div>
      </div>

      {/* Visual Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness History Chart */}
        <div className="lg:col-span-2 premium-card rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <h3 className="text-[10px] font-bold uppercase font-mono tracking-widest text-slate-400 flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-400" /> Readiness Score Growth
              </h3>
            </div>
          </div>
          <ProgressChart data={history} height={240} />
        </div>

        {/* Categories Distribution */}
        <div className="premium-card rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-[10px] font-bold uppercase font-mono tracking-widest text-slate-400 flex items-center gap-2">
              <PieChart className="h-4 w-4 text-cyan-400" /> Technology Domains
            </h3>
          </div>
          <GrowthChart data={charts.skillCategoryData} height={240} />
        </div>

        {/* Progress Buckets distribution */}
        <div className="lg:col-span-3 premium-card rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-[10px] font-bold uppercase font-mono tracking-widest text-slate-400 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-400" /> Proficiency Level Distribution
            </h3>
          </div>
          <SkillsChart data={charts.progressBuckets} height={220} />
        </div>
      </div>

      {/* Certificates list */}
      <div className="premium-card rounded-2xl p-6 text-left">
        <h3 className="text-base font-bold text-white tracking-tight mb-5 flex items-center gap-2 font-display">
          <Award className="h-5 w-5 text-cyan-400" /> Approved Credentials & Certificates
        </h3>

        {dbLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-12 bg-white/5 rounded-xl" />
            <div className="h-12 bg-white/5 rounded-xl" />
          </div>
        ) : certificates.length === 0 ? (
          <EmptyState
            title="No Academic Certificates registered"
            description="Catalog completed certificates (e.g., AWS, freeCodeCamp, Udemy). Having approved industrial certificates significantly elevates resume verification metrics."
            actionLabel="Catalog Certificate"
            onAction={() => setModalOpen(true)}
            icon={<Award className="h-6 w-6 text-cyan-400" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-black/40 hover:bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-2xl p-4 flex justify-between items-start transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/15 shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white font-sans">{cert.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Issuer: <span className="text-cyan-400 font-semibold">{cert.issuer}</span>
                    </p>
                    {cert.credential_id && (
                      <p className="text-[10px] text-slate-500 font-mono mt-1">ID: {cert.credential_id}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/10 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors"
                      title="View Credential"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteCert(cert.id)}
                    className="p-2 rounded-xl bg-white/[0.02] hover:bg-red-500/10 text-slate-500 hover:text-red-400 cursor-pointer transition-colors"
                    title="Delete Credential"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CRUD Modal dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Catalog Professional Certificate"
      >
        <form onSubmit={handleAddCert} className="space-y-4 text-slate-200">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Certificate Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
              placeholder="e.g. AWS Certified Solutions Architect"
              required
              disabled={formLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
                Issuing Organization
              </label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
                placeholder="e.g. Amazon Web Services, Google"
                required
                disabled={formLoading}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
                Credential Verification ID (Optional)
              </label>
              <input
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
                placeholder="e.g. AWS-123456"
                disabled={formLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-2">
              Verification URL (Optional)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
              placeholder="https://credly.com/your-verification"
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
              Catalog Credential
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AnalyticsPage;
