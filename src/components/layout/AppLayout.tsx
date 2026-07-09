import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Ambient3DBackground from "../ui/Ambient3DBackground";

export const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Map route paths to friendly section names for the top navbar
  const getRouteTitle = (path: string) => {
    if (path.startsWith("/dashboard")) return "Academic Console";
    if (path.startsWith("/skills")) return "Industrial Skills Matrix";
    if (path.startsWith("/projects")) return "SaaS Project Portfolio";
    if (path.startsWith("/roadmap")) return "Personalized AI Roadmaps";
    if (path.startsWith("/interview")) return "Simulated Mock Screenings";
    if (path.startsWith("/resume")) return "ATS Document Analyzer";
    if (path.startsWith("/analytics")) return "Readiness Growth Hub";
    if (path.startsWith("/profile")) return "Student Identity Profile";
    if (path.startsWith("/settings")) return "System Preferences";
    return "SkillBridge Console";
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex overflow-hidden font-sans relative">
      {/* Noise grain layer */}
      <div className="noise-overlay" />

      {/* Premium ambient mesh background blobs */}
      <div className="bg-mesh">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>

      {/* Premium 3D Ambient Hologram background elements */}
      <Ambient3DBackground />

      {/* Navigation Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Navbar */}
        <Navbar
          onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          title={getRouteTitle(location.pathname)}
        />

        {/* Dynamic Nested Content Panel */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-transparent scrollbar-thin">
          <div className="max-w-7xl mx-auto w-full pb-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, scale: 0.995, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.995, y: -12, filter: "blur(4px)" }}
                transition={{ type: "spring", duration: 0.55, bounce: 0.08 }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
