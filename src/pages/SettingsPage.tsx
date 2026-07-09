import React from "react";
import { Settings, Shield, Link2, Mail, Info, Terminal, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const SettingsPage: React.FC = () => {
  const { isConfigured } = useAuth();

  return (
    <div className="space-y-8 select-none max-w-4xl text-left">
      {/* Header section */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/15 text-[10px] text-slate-300 font-mono font-bold uppercase tracking-wider mb-2">
          System Core
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
          <Settings className="h-6 w-6 text-slate-400" /> System Preferences
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed font-sans">
          Review active service connection strings, database configurations, and portal variables.
        </p>
      </div>

      <div className="space-y-6">
        {/* Backend & Supabase Status */}
        <div className="premium-card rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2.5 font-sans">
            <Link2 className="h-5 w-5 text-indigo-400" /> Database Integration Engine
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            SkillBridge AI is built with a dual backend. By default, if no Supabase environment credentials are found, the app engages a highly optimized, state-synchronized <b>Sandbox Engine</b> backed by local client storage.
          </p>

          <div className={`p-4 rounded-xl border flex gap-3 text-xs items-start transition-all duration-300 ${
            isConfigured 
              ? "bg-emerald-500/[0.03] border-emerald-500/20 text-slate-300 shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
              : "bg-indigo-500/[0.03] border-indigo-500/20 text-slate-300 shadow-[0_0_20px_rgba(99,102,241,0.05)]"
          }`}>
            <Info className={`h-5 w-5 shrink-0 ${isConfigured ? "text-emerald-400" : "text-indigo-400"}`} />
            <div className="space-y-1.5 text-left">
              <span className="font-bold block text-sm">
                Current Connection Node: {isConfigured ? "Supabase Cloud DB (Active)" : "Offline Local Sandbox (Active)"}
              </span>
              <p className="text-slate-400 leading-relaxed font-sans">
                {isConfigured 
                  ? "Standard RLS policies are active on your Supabase PostgreSQL database tables. Real-time changes are synchronized instantly." 
                  : "All data is persisted inside local browser storage key-values. To connect your own production database, specify 'VITE_SUPABASE_URL' and 'VITE_SUPABASE_ANON_KEY' inside your .env configuration."}
              </p>
            </div>
          </div>
        </div>

        {/* AI & Vision engines */}
        <div className="premium-card rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2.5 font-sans">
            <Terminal className="h-5 w-5 text-purple-400" /> Server-Side AI Intelligence Node
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Personalized Roadmaps and simulated mock screens are engineered utilizing advanced server-side Gemini endpoints proxying securely to hide keys from the frontend browser.
          </p>

          <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2.5 text-xs font-mono text-slate-400 text-left">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Gemini LLM Engine:</span>
              <span className="text-indigo-400 font-bold">gemini-2.5-flash</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/[0.02] pt-2">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Vision OCR Capability:</span>
              <span className="text-purple-400 font-bold">Enabled</span>
            </div>
          </div>
        </div>

        {/* Resend Integration Status */}
        <div className="premium-card rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2.5 font-sans">
            <Mail className="h-5 w-5 text-cyan-400" /> Transactional Email Service
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            SkillBridge AI incorporates professional, transactional, welcome and reminder mail systems through our integrated Resend backend endpoint.
          </p>

          <div className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-start gap-3.5 text-xs text-slate-400 text-left">
            <Shield className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <span className="font-bold block text-slate-300 text-sm">Mail Dispatch Configured:</span>
              <p className="font-sans leading-relaxed text-slate-400">
                All mock transactional alerts, placement milestones, and welcome letters are set to securely dispatch to <b>sanketr980@gmail.com</b> using the active Resend API channel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
