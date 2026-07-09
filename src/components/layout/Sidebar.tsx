import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Code,
  FolderGit2,
  Map,
  HelpCircle,
  FileSearch,
  TrendingUp,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const { signOut, profile } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Skills Tracker", path: "/skills", icon: Code },
    { name: "Projects", path: "/projects", icon: FolderGit2 },
    { name: "Learning Roadmaps", path: "/roadmap", icon: Map },
    { name: "Interview Prep", path: "/interview", icon: HelpCircle },
    { name: "Resume Analyzer", path: "/resume", icon: FileSearch },
    { name: "Analytics Hub", path: "/analytics", icon: TrendingUp },
    { name: "My Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings }
  ];

  const sidebarVariants = {
    expanded: { width: "260px" },
    collapsed: { width: "76px" }
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <motion.aside
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-y-0 lg:inset-y-4 lg:left-4 bg-[#050814]/40 border border-white/5 lg:rounded-2xl z-40 flex flex-col justify-between transition-all duration-300 lg:translate-x-0 shadow-2xl backdrop-blur-3xl ${
          mobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full lg:relative lg:flex"
        }`}
      >
        {/* Top Logo Section */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 bg-transparent">
            <div className="flex items-center gap-4 overflow-visible group/brand min-w-max">
              <div className="relative shrink-0 flex-shrink-0">
                {/* Glowing Outer Aura */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-xl blur-md opacity-70 group-hover/brand:opacity-100 transition duration-500" />
                {/* Sleek High-Tech Inner Card */}
                <div className="relative flex items-center justify-center h-11.5 w-11.5 bg-[#030712]/90 border border-white/10 rounded-xl text-indigo-300 group-hover/brand:text-white transition duration-300 flex-shrink-0">
                  <GraduationCap className="h-6 w-6 flex-shrink-0" />
                  {/* Micro Neon Pulse Badge */}
                  <div className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-slate-950 flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                </div>
              </div>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col whitespace-nowrap text-left min-w-max flex-shrink-0 overflow-visible"
                >
                  <div className="flex items-center">
                    <span className="font-extrabold text-white text-[15px] md:text-base tracking-normal font-display bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
                      SkillBridge AI
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400/80 font-medium tracking-[0.11em] uppercase font-sans leading-none mt-1.5">
                    Industry Ready Platform
                  </span>
                </motion.div>
              )}
            </div>
 
            {/* Collapse Trigger Desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer border border-transparent hover:border-white/5"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
 
          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 relative">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium border overflow-visible ${
                      isActive
                        ? "text-indigo-300 font-semibold"
                        : "text-slate-400 border-transparent hover:text-white hover:bg-white/[0.03]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Interactive sliding layout active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-pill"
                          className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/15 rounded-xl z-0"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}

                      {/* Interactive glowing left accent line for active links */}
                      {isActive && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-full bg-gradient-to-b from-indigo-400 to-purple-500 z-10" />
                      )}
                      
                      <Icon className={`h-5 w-5 shrink-0 transition-all duration-300 relative z-10 ${isActive ? "text-indigo-400 scale-105" : "text-slate-400 group-hover:scale-110 group-hover:text-white"}`} />
                      
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="whitespace-nowrap font-sans relative z-10"
                        >
                          {item.name}
                        </motion.span>
                      )}

                      {/* Premium Floating Tooltip for Collapsed Sidebar */}
                      {isCollapsed && (
                        <div className="absolute left-[70px] px-2.5 py-1.5 rounded-lg bg-slate-950/95 border border-white/10 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-[0_10px_25px_rgba(0,0,0,0.5),_inset_0_1px_1px_rgba(255,255,255,0.05)] translate-x-2 group-hover:translate-x-0 z-50">
                          {item.name}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
 
         {/* Bottom Profile and Logout Section */}
        <div className="p-3 border-t border-white/5 bg-transparent space-y-3.5">
          {!isCollapsed && profile && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3.5"
            >
              {/* Sleek Industry Readiness Progress Widget */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#0a0f24] to-[#120a24] border border-indigo-500/15 shadow-[0_4px_20px_rgba(99,102,241,0.05)]">
                <p className="text-xs text-indigo-300 font-semibold mb-1.5 uppercase tracking-wider font-mono">Industry Readiness</p>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-400 via-purple-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-500" 
                    style={{ width: `${profile.readiness_score || 50}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-mono">
                  Level {profile.readiness_score || 50}% &bull; Top {Math.max(1, 100 - Math.round((profile.readiness_score || 50) * 0.88))}%
                </p>
              </div>
 
              <div className="flex items-center gap-3 px-3 py-2 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 group/avatar cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 text-xs shrink-0 font-mono group-hover/avatar:scale-105 transition-transform duration-300">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-semibold text-white truncate font-sans group-hover/avatar:text-indigo-200 transition-colors duration-300">{profile.name}</span>
                  <span className="text-[10px] text-slate-500 truncate font-mono">{profile.email}</span>
                </div>
              </div>
            </motion.div>
          )}
 
          <motion.button
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 text-sm font-medium cursor-pointer border border-transparent hover:border-red-500/10"
          >
            <LogOut className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:rotate-6" />
            {!isCollapsed && <span className="whitespace-nowrap font-sans">Sign Out</span>}
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
