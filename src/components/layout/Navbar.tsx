import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  CheckCircle2,
  ChevronRight,
  Settings,
  Search,
  Sparkles,
  Command,
  User,
  LogOut,
  Clock,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";

interface NavbarProps {
  onMenuClick: () => void;
  title: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, title }) => {
  const { profile, signOut } = useAuth();
  const { notifications, markNotificationRead } = useDashboard();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadNotifications = notifications.filter((n) => !n.read);
  const score = profile?.readiness_score || 50;

  // Mock console systems quick navigation for search
  const searchablePages = [
    { name: "Academic Console", path: "/dashboard", desc: "Main metrics & milestones" },
    { name: "Industrial Skills Matrix", path: "/skills", desc: "Skills tracker & levels" },
    { name: "SaaS Project Portfolio", path: "/projects", desc: "Review sandboxed modules" },
    { name: "Personalized AI Roadmaps", path: "/roadmap", desc: "Review custom goals & roadmaps" },
    { name: "Simulated Mock Screenings", path: "/interview", desc: "Prepare for interviews" },
    { name: "ATS Document Analyzer", path: "/resume", desc: "Review resume analysis feedback" },
    { name: "Readiness Growth Hub", path: "/analytics", desc: "Visual analytics & distributions" },
    { name: "Student Identity Profile", path: "/profile", desc: "Configure your biography" },
    { name: "System Preferences", path: "/settings", desc: "Configure database & API nodes" }
  ];

  const filteredPages = searchablePages.filter((page) =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 h-16 border-b border-white/5 bg-[#02040a]/40 backdrop-blur-3xl z-30 px-4 lg:px-8 flex items-center justify-between">
      {/* Mobile Menu & Section Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5 text-slate-400 text-sm">
          <span className="font-extrabold text-indigo-400 tracking-tight font-display text-xs uppercase tracking-wider">
            SkillBridge
          </span>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <h1 className="text-white font-bold tracking-tight text-[11px] uppercase font-mono bg-gradient-to-r from-indigo-200 to-slate-100 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
      </div>

      {/* OS Search Bar (Interactive / Expanding) */}
      <div className="hidden md:flex relative max-w-sm w-full mx-4 z-40">
        <div
          className={`relative flex items-center w-full rounded-full transition-all duration-300 border ${
            searchFocused
              ? "bg-slate-950/90 border-indigo-500/35 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]"
              : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
          }`}
        >
          <Search className={`h-4 w-4 ml-4 shrink-0 transition-colors ${searchFocused ? "text-indigo-400" : "text-slate-500"}`} />
          <input
            type="text"
            placeholder="Search console nodes... (Press ⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="w-full bg-transparent pl-2.5 pr-12 py-2 text-xs text-white placeholder-slate-500 font-sans focus:outline-none"
          />
          <div className="absolute right-4 flex items-center gap-0.5 pointer-events-none text-[9px] font-mono font-bold text-slate-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Dynamic Command Suggestions Panel */}
        <AnimatePresence>
          {searchFocused && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="absolute top-12 left-0 right-0 p-2 rounded-2xl bg-slate-950/95 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-hidden z-50 text-left"
            >
              <div className="px-3.5 py-2 border-b border-white/5 flex justify-between items-center bg-white/[0.02] rounded-t-xl">
                <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">Available Nodes</span>
                <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
              </div>
              <div className="max-h-60 overflow-y-auto mt-1 space-y-0.5 pr-1 scrollbar-thin">
                {filteredPages.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500 font-sans">No matching nodes found.</div>
                ) : (
                  filteredPages.map((page) => (
                    <button
                      key={page.path}
                      onClick={() => navigate(page.path)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/[0.04] transition-all group/item cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-200 group-hover/item:text-white font-sans transition-colors">
                          {page.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {page.desc}
                        </span>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-600 group-hover/item:text-indigo-400 transition-colors" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Telemetry Actions */}
      <div className="flex items-center gap-5">
        {/* Industry Readiness Micro Indicator */}
        {profile && (
          <div className="hidden sm:flex items-center gap-3 bg-white/[0.03] border border-white/5 px-4 py-1.5 rounded-full shadow-lg">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
              Readiness Index:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono">{score}%</span>
              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                    score >= 75
                      ? "from-emerald-500 to-teal-400"
                      : score >= 55
                      ? "from-indigo-500 to-purple-400"
                      : "from-amber-500 to-orange-400"
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDropdown(false);
            }}
            className="relative p-2 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/10 text-slate-400 hover:text-slate-100 transition-all duration-300 cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-indigo-500 rounded-full ring-2 ring-[#02040a] animate-pulse" />
            )}
          </motion.button>

          {/* Notifications Panel */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 12 }}
                  transition={{ type: "spring", duration: 0.4 }}
                  className="absolute right-0 mt-3 w-80 premium-card rounded-2xl z-40 overflow-hidden py-1 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl text-left"
                >
                  <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest font-mono">
                      App Alerts
                    </span>
                    {unreadNotifications.length > 0 && (
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono">
                        {unreadNotifications.length} New
                      </span>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500 font-sans">
                        No alerts on file.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                          }}
                          className={`p-3.5 text-xs transition-all duration-200 cursor-pointer hover:bg-white/5 flex gap-2.5 items-start ${
                            !notif.read ? "bg-indigo-500/[0.03]" : ""
                          }`}
                        >
                          <CheckCircle2
                            className={`h-4 w-4 shrink-0 mt-0.5 ${
                              notif.read ? "text-slate-600" : "text-indigo-400"
                            }`}
                          />
                          <div className="flex flex-col gap-0.5">
                            <p
                              className={`text-slate-300 font-sans leading-relaxed ${
                                !notif.read ? "font-semibold text-white" : ""
                              }`}
                            >
                              {notif.text}
                            </p>
                            <span className="text-[10px] text-slate-500 font-mono mt-1">
                              {new Date(notif.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar Trigger Settings */}
        {profile && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotifications(false);
              }}
              className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 p-[1.5px] shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              <div className="h-full w-full rounded-full bg-[#030712] flex items-center justify-center font-black text-slate-200 text-xs font-sans">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            </motion.button>

            {/* Profile Menu Dropdown */}
            <AnimatePresence>
              {showProfileDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowProfileDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 12 }}
                    transition={{ type: "spring", duration: 0.4 }}
                    className="absolute right-0 mt-3 w-64 premium-card rounded-2xl z-40 overflow-hidden py-1 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl text-left"
                  >
                    {/* User profile capsule card */}
                    <div className="p-4 border-b border-white/5 bg-white/[0.01]">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest font-mono block mb-1">
                        Active Identity
                      </span>
                      <p className="text-xs font-bold text-white font-sans truncate">{profile.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">{profile.email}</p>
                    </div>

                    {/* Clock System info */}
                    <div className="px-4 py-2 border-b border-white/5 bg-slate-900/10 flex items-center gap-2 text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                        Ready to deploy
                      </span>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          navigate("/profile");
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.03] transition-all cursor-pointer"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        <span>My Profile Identity</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          navigate("/settings");
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.03] transition-all cursor-pointer"
                      >
                        <Settings className="h-4 w-4 text-slate-400" />
                        <span>Preferences Configuration</span>
                      </button>

                      <div className="border-t border-white/5 my-1" />

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out Console</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
