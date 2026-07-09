import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Code,
  FolderGit2,
  Map,
  HelpCircle,
  FileSearch,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  Trophy,
  Activity,
  ArrowRight,
  Brain,
  Cpu,
  Terminal,
  Sliders,
  Calendar,
  Flame,
  RefreshCw,
  Layers,
  Bell,
  Star,
  AlertTriangle,
  Zap,
  Play,
  Award,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Percent
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import { useSkills } from "../context/SkillContext";
import { useAnalytics } from "../hooks/useAnalytics";
import { useToast } from "../hooks/useToast";
import { visionService } from "../api/vision";
import { interviewsService } from "../api/interviews";
import ProgressChart from "../components/charts/ProgressChart";
import Button from "../components/ui/Button";

export const DashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const { skills, loading: skillsLoading } = useSkills();
  const { goals, addGoal, toggleGoal, deleteGoal, projects, roadmaps } = useDashboard();
  const { stats, history } = useAnalytics();
  const toast = useToast();
  const navigate = useNavigate();

  // Local operational state
  const [newGoalText, setNewGoalText] = useState("");
  const [goalLoading, setGoalLoading] = useState(false);
  const [systemTime, setSystemTime] = useState("");
  const [cpuUsage, setCpuUsage] = useState(42);
  const [isCompilingReport, setIsCompilingReport] = useState(false);
  const [compilationProgress, setCompilationProgress] = useState(0);
  const [compilationLogs, setCompilationLogs] = useState<string[]>([]);
  const [compiledReport, setCompiledReport] = useState<any | null>(null);
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [lastInterviewScore, setLastInterviewScore] = useState<number | null>(null);
  const [latestAnalysis, setLatestAnalysis] = useState<any | null>(null);
  const [matrixClicks, setMatrixClicks] = useState<Record<string, boolean>>({});
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // Sound Synth Generator (Web Audio API for UI sensory cues)
  const playSound = (freq = 800, type: OscillatorType = "sine", duration = 0.08, volume = 0.03) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio system is idle or requires direct interaction
    }
  };

  // Sonar sweep synth
  const playSonarSweep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);
      
      gainNode.gain.setValueAtTime(0.04, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.45);
    } catch (e) {}
  };

  // Clock telemetry synchronization
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
      setSystemTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // CPU Fluctuator for immersive telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        const next = prev + delta;
        return Math.max(28, Math.min(84, next));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Load real database data for Resume analyses & completed interview scores
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const analyses = await visionService.getAnalyses();
        if (analyses && analyses.length > 0) {
          const sorted = [...analyses].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setAtsScore(sorted[0].atsScore);
          setLatestAnalysis(sorted[0]);
        }
        
        const preps = await interviewsService.getInterviews();
        if (preps && preps.length > 0) {
          const completed = preps.filter((p) => p.score !== undefined && p.score !== null);
          if (completed.length > 0) {
            setLastInterviewScore(completed[0].score || null);
          }
        }
      } catch (err) {
        console.warn("Failed to load telemetry overlays:", err);
      }
    };
    fetchRealData();
  }, [skills, projects, roadmaps]);

  // Skill calculations (Strongest vs Weakest)
  const sortedSkills = [...skills].sort((a, b) => a.progress - b.progress);
  const weakestSkill = sortedSkills[0] || null;
  const strongestSkill = sortedSkills[sortedSkills.length - 1] || null;

  // Add goal submission
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    setGoalLoading(true);
    try {
      await addGoal(newGoalText.trim());
      setNewGoalText("");
      playSound(1000, "triangle", 0.15);
      toast.success("Goal successfully integrated into AI timeline!");
    } catch (err) {
      toast.error("Failed to integrate goal.");
    } finally {
      setGoalLoading(false);
    }
  };

  const handleToggleGoal = async (id: string, completed: boolean) => {
    try {
      await toggleGoal(id, completed);
      playSound(completed ? 1200 : 700, "sine", 0.1, 0.04);
      toast.success(completed ? "Milestone logged! 🎉" : "Milestone reset.");
    } catch (err) {
      toast.error("Failed to update milestone.");
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteGoal(id);
      playSound(500, "sawtooth", 0.1, 0.02);
      toast.success("Milestone removed.");
    } catch (err) {
      toast.error("Failed to remove milestone.");
    }
  };

  // Simulation of advanced neural compilation
  const runAIReportCompiler = () => {
    playSound(400, "sawtooth", 0.3, 0.02);
    setIsCompilingReport(true);
    setCompilationProgress(0);
    setCompilationLogs([]);
    setCompiledReport(null);

    const logSteps = [
      "Initializing diagnostic interface ... OK",
      "Analyzing neural cognitive structures ...",
      "Scanning industrial skill competencies ...",
      "Reading sandbox portfolio files ...",
      "Running semantic keywords matches against 500+ tech companies ...",
      "Compiling telemetry predictive models ...",
      "Constructing final OS executive placement score ..."
    ];

    let stepIndex = 0;
    const logInterval = setInterval(() => {
      if (stepIndex < logSteps.length) {
        setCompilationLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${logSteps[stepIndex]}`]);
        playSound(800 + stepIndex * 120, "sine", 0.05, 0.02);
        stepIndex++;
      }
    }, 600);

    const progressInterval = setInterval(() => {
      setCompilationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(logInterval);
          
          // Generate final report parameters based on actual profile data
          const currentScore = profile?.readiness_score || 50;
          const predictedSalary = Math.floor(82000 + currentScore * 650);
          const completionRatio = skills.length > 0 
            ? Math.round((skills.filter(s => s.progress >= 80).length / skills.length) * 100) 
            : 0;

          setCompiledReport({
            grade: currentScore >= 80 ? "Class ALPHA-1" : currentScore >= 60 ? "Class BETA-2" : "Class GAMMA-3",
            confidence: Math.round(55 + currentScore * 0.42),
            salary: predictedSalary.toLocaleString(),
            optimalStack: profile?.role_target?.includes("Frontend") 
              ? "React + Next.js + Tailwind + Vercel" 
              : profile?.role_target?.includes("Backend")
              ? "Node.js + NestJS + PostgreSQL + Redis"
              : "React + Node.js + Express + PostgreSQL + Docker",
            gaps: latestAnalysis?.gaps?.slice(0, 3) || ["Docker Containers", "CI/CD Automations", "Redis Middleware"],
            achievements: [
              `Completed ${skills.filter(s => s.progress >= 80).length} advanced core competency modules`,
              `Managed ${projects.length} sandbox projects on file`,
              `Successfully established ${roadmaps.length} AI learning schedules`
            ]
          });
          playSound(1000, "triangle", 0.25, 0.05);
          toast.success("OS Intelligence Report compiled successfully!");
          return 100;
        }
        return prev + 5;
      });
    }, 180);
  };

  // Interactive brain cell click
  const handleCellClick = (key: string) => {
    playSound(900 + Math.random() * 400, "sine", 0.06, 0.04);
    setMatrixClicks((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Interactive cognitive pulse emitted at terminal point.");
  };

  // Filter searchable items in dashboard
  const fastTravelOptions = [
    { name: "Academic Skills Console", path: "/skills", tag: "skills", desc: "Manage industrial skills matrix", icon: <Code className="h-4 w-4" /> },
    { name: "Portfolio Project Vault", path: "/projects", tag: "projects", desc: "Exhibit active code bases", icon: <FolderGit2 className="h-4 w-4" /> },
    { name: "Autonomous AI Pathways", path: "/roadmap", tag: "roadmaps", desc: "Access personalized roadmaps", icon: <Map className="h-4 w-4" /> },
    { name: "ATS Document Scanner", path: "/resume", tag: "resume", desc: "Inspect resume match rates", icon: <FileSearch className="h-4 w-4" /> },
    { name: "Readiness Analytics Center", path: "/analytics", tag: "analytics", desc: "View detailed statistics", icon: <Activity className="h-4 w-4" /> }
  ];

  const filteredFastTravel = fastTravelOptions.filter((opt) =>
    opt.name.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
    opt.desc.toLowerCase().includes(dashboardSearch.toLowerCase())
  );

  return (
    <div className="relative space-y-8 select-none text-left z-10 pb-12">
      {/* Background Neon Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* TOP DEPLOYMENT TELEMETRY PANEL */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass border border-white/5 bg-[#030712]/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
              AI-OS KERNEL: ONLINE
            </span>
          </div>
          <div className="h-4 w-px bg-white/5 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <Cpu className="h-3 w-3 text-indigo-400" />
            <span>NEURAL LOAD: <b className="text-white">{cpuUsage}%</b></span>
          </div>
          <div className="h-4 w-px bg-white/5 hidden md:block" />
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <Layers className="h-3 w-3 text-purple-400" />
            <span>SYNAPSE MATRIX: <b className="text-white">Active</b></span>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto text-[10px] font-mono">
          <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-md font-bold">
            UTC COORD: 2026-07-09
          </span>
          <span className="text-slate-300 font-semibold flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            <Clock className="h-3 w-3 text-cyan-400" />
            {systemTime || "04:13:00"}
          </span>
        </div>
      </div>

      {/* SEARCH COMMAND PALETTE BOX */}
      <div className="relative group max-w-xl mx-auto w-full z-20">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-xl opacity-40 group-hover:opacity-75 transition duration-1000" />
        <div className="relative flex items-center bg-black/60 border border-white/10 rounded-2xl p-1 shadow-2xl backdrop-blur-2xl transition-all duration-300 focus-within:border-indigo-500/50 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.25)]">
          <Terminal className="h-4 w-4 text-indigo-400 ml-4 shrink-0" />
          <input
            type="text"
            placeholder="Query terminal commands or nodes... (e.g. skills)"
            value={dashboardSearch}
            onChange={(e) => {
              setDashboardSearch(e.target.value);
              playSound(700 + e.target.value.length * 10, "sine", 0.05, 0.01);
            }}
            className="w-full bg-transparent px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
          />
          {dashboardSearch && (
            <button
              onClick={() => setDashboardSearch("")}
              className="p-1 text-slate-500 hover:text-white text-xs mr-2 cursor-pointer font-mono font-bold"
            >
              CLEAR
            </button>
          )}
          <div className="flex items-center gap-1 text-[9px] font-mono bg-white/5 border border-white/5 px-2 py-1 rounded-xl text-slate-400 mr-2 shrink-0">
            <span>ALT + C</span>
          </div>
        </div>

        {/* Dynamic drop panel when search entered */}
        <AnimatePresence>
          {dashboardSearch && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute top-14 left-0 right-0 p-2.5 rounded-2xl bg-slate-950/95 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-3xl z-40 text-left"
            >
              <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest px-3 py-1 bg-white/[0.02] rounded-lg mb-1.5 flex justify-between items-center">
                <span>FOUND SYSTEM NODES</span>
                <Percent className="h-3 w-3" />
              </div>
              <div className="space-y-0.5">
                {filteredFastTravel.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-600 font-mono">
                    No active neural nodes match query.
                  </div>
                ) : (
                  filteredFastTravel.map((opt) => (
                    <button
                      key={opt.path}
                      onClick={() => {
                        playSound(1100, "triangle", 0.1);
                        navigate(opt.path);
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-white/[0.04] text-left transition-all group/opt cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 rounded-lg group-hover/opt:scale-105 transition-all">
                          {opt.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200 group-hover/opt:text-white transition-colors">
                            {opt.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{opt.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-600 group-hover/opt:text-indigo-400 transition-colors" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CORE OPERATIONAL WELCOME BANNER */}
      <div className="premium-card p-8 rounded-3xl relative overflow-hidden group border border-white/[0.06] bg-gradient-to-br from-slate-950/80 via-slate-900/40 to-slate-950/80">
        <div className="absolute right-[-10%] top-[-30%] w-96 h-96 bg-indigo-600/10 rounded-full filter blur-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute left-[-5%] bottom-[-10%] w-72 h-72 bg-cyan-500/5 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          <div className="space-y-3.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 font-mono font-bold uppercase tracking-wider">
              <Brain className="h-3 w-3 text-indigo-400 animate-pulse" />
              INTELLIGENT DIAGNOSTIC HUB
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">
              Welcome, {profile?.name || "Student"}{" "}
              <span className="inline-block hover:animate-spin duration-1000 origin-center cursor-pointer">🌌</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans max-w-2xl">
              Target role configuration initialized for{" "}
              <b className="text-white underline decoration-indigo-500/50 decoration-2 font-mono">
                {profile?.role_target || "Full-Stack Software Engineer"}
              </b>
              . AI placement simulations have cataloged your progress levels. Complete the daily cognitive challenges below to unlock optimal readiness factors.
            </p>
            
            <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-indigo-400" />
                <span>Readiness Score: <b className="text-indigo-300 font-bold">{profile?.readiness_score || 50}%</b></span>
              </div>
              <div className="h-3 w-px bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-purple-400" />
                <span>Skills Loaded: <b className="text-purple-300 font-bold">{skills.length}</b></span>
              </div>
              <div className="h-3 w-px bg-white/10" />
              <div className="flex items-center gap-1.5">
                <FolderGit2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Active Sandbox Projects: <b className="text-cyan-300 font-bold">{projects.length}</b></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3.5 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => {
                playSonarSweep();
                runAIReportCompiler();
              }}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold font-mono uppercase tracking-wider shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all cursor-pointer border border-indigo-400/20 active:scale-[0.97]"
            >
              <Cpu className="h-4 w-4 animate-spin-slow" /> Generate AI Report
            </button>
            <Link to="/interview" className="flex-1 lg:flex-none">
              <Button variant="secondary" size="md" className="w-full font-bold font-mono text-xs tracking-wider uppercase">
                <Sparkles className="h-4 w-4 mr-2 text-purple-300" /> Start Mock Interview
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* CORE CIRCULAR GAUGES & INTEL BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* WIDGET 1: NEON READINESS SPEEDOMETER */}
        <div className="premium-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between group min-h-[190px] border border-white/5">
          <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none" />
          <div className="absolute top-[-20%] right-[-20%] w-24 h-24 bg-indigo-500/10 rounded-full filter blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500" />
          
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Core Telemetry</span>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-tight">Readiness Index</h4>
            </div>
            <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/10">
              <Trophy className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center gap-4 py-3">
            {/* SVG Circular Gauge */}
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.04)" strokeWidth="5" fill="transparent" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#6366f1"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={175}
                  strokeDashoffset={175 - (175 * (profile?.readiness_score || 50)) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-black text-white font-mono">{profile?.readiness_score || 50}%</span>
              </div>
            </div>
            <div className="space-y-1 text-left">
              <p className="text-2xl font-bold text-white tracking-tight font-display">
                {profile?.readiness_score || 50}
                <span className="text-xs text-slate-500 font-normal"> / 100</span>
              </p>
              <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/15">
                OPTIMAL GROWTH
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 pt-2 border-t border-white/5 leading-normal">
            Calculated index dynamically aggregates active skills logs & finished sandbox projects.
          </p>
        </div>

        {/* WIDGET 2: COMPETENCY DIAGNOSTICS (Strongest / Weakest) */}
        <div className="premium-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between group min-h-[190px] border border-white/5">
          <div className="absolute top-[-20%] right-[-20%] w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl opacity-30" />
          
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Skills Core</span>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-tight">Competency Diagnostics</h4>
            </div>
            <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/10">
              <Sliders className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-3.5 py-1">
            {strongestSkill ? (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-400 uppercase tracking-wider">STRONGEST:</span>
                  <span className="text-indigo-400 font-bold truncate max-w-[120px]">{strongestSkill.name}</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-400" style={{ width: `${strongestSkill.progress}%` }} />
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-slate-500 italic font-mono">Awaiting skill matrix entries ...</p>
            )}

            {weakestSkill ? (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-400 uppercase tracking-wider">WEAKEST GAPS:</span>
                  <span className="text-cyan-400 font-bold truncate max-w-[120px]">{weakestSkill.name}</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-400" style={{ width: `${weakestSkill.progress}%` }} />
                </div>
              </div>
            ) : null}
          </div>

          <p className="text-[10px] text-slate-500 pt-2 border-t border-white/5 leading-normal">
            {weakestSkill 
              ? `AI recommendation: Boost ${weakestSkill.name} beyond 70% to optimize matching index.`
              : "Register tech stacks in Skills page to activate gap optimization overlays."}
          </p>
        </div>

        {/* WIDGET 3: RESUME INTEL SCANNER (ATS Matching Score) */}
        <div className="premium-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between group min-h-[190px] border border-white/5">
          <div className="absolute top-[-20%] right-[-20%] w-24 h-24 bg-cyan-500/10 rounded-full filter blur-xl opacity-30" />
          
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Document Scanner</span>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-tight">Resume ATS score</h4>
            </div>
            <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/10">
              <FileSearch className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <span className="text-3xl font-extrabold text-white tracking-tight font-display">
              {atsScore ? `${atsScore}%` : "NONE"}
            </span>
            <div className="space-y-0.5">
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">PREDICTED CLUSTER</p>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${atsScore && atsScore >= 80 ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/10" : "text-amber-400 bg-amber-500/10 border border-amber-500/10"}`}>
                {atsScore ? (atsScore >= 80 ? "EXECUTIVE MATCH" : "INTERMEDIATE") : "AWAITING PDF SCAN"}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 pt-2 border-t border-white/5 leading-normal truncate">
            {latestAnalysis?.atsRecommendations?.[0] || "No scan detected on record. Access resume tab."}
          </p>
        </div>

        {/* WIDGET 4: SIMULATED SCREENING HISTORY */}
        <div className="premium-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between group min-h-[190px] border border-white/5">
          <div className="absolute top-[-20%] right-[-20%] w-24 h-24 bg-emerald-500/10 rounded-full filter blur-xl opacity-30" />
          
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Interview Console</span>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-tight">Screening readiness</h4>
            </div>
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/10">
              <Award className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <span className="text-3xl font-extrabold text-white tracking-tight font-display">
              {lastInterviewScore ? `${lastInterviewScore}/100` : "N/A"}
            </span>
            <div className="space-y-0.5">
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">LATEST PREP PERFORMANCE</p>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${lastInterviewScore ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/10" : "text-slate-500 bg-white/5 border border-white/5"}`}>
                {lastInterviewScore ? "SCREENED LOGGED" : "NOT UNDERGONE"}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 pt-2 border-t border-white/5 leading-normal">
            Take an interactive technical or behavioral screening mock interview to refresh this score.
          </p>
        </div>
      </div>

      {/* CORE BENTO SYSTEM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: GROWTH TIMELINE & COGNITIVE ACTIVITY MATRIX */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* DYNAMIC READINESS SCORE growth chart */}
          <div className="premium-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-indigo-400/50">COGNITIVE INDEX INDEX_T</div>
            
            <div className="flex justify-between items-center mb-6 z-10">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-display">
                  <Activity className="h-4.5 w-4.5 text-indigo-400" /> Placement Score Growth Analytics
                </h3>
                <p className="text-xs text-slate-400 mt-1">Real-time predictive telemetry compiled from daily neural actions.</p>
              </div>
              <span className="text-[9px] uppercase font-mono font-black tracking-widest px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 rounded-full">
                ACTIVE TELEMETRY SYNC
              </span>
            </div>
            
            <div className="w-full">
              <ProgressChart data={history} height={250} />
            </div>
          </div>

          {/* FUTURISTIC COGNITIVE BRAIN HEATMAP MATRIX (GitHub commits clone) */}
          <div className="premium-card rounded-2xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-display">
                  <Brain className="h-4.5 w-4.5 text-cyan-400" /> COGNITIVE SYSTEM PULSES MATRIX
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Click core terminal nodes to fire manual cognitive signals.</p>
              </div>
              <span className="text-[10px] font-mono text-slate-500">7x16 INTEGRATION TILES</span>
            </div>

            {/* Matrix Board */}
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <div className="grid grid-cols-16 gap-1.5">
                {Array.from({ length: 112 }).map((_, i) => {
                  const x = i % 16;
                  const y = Math.floor(i / 16);
                  const key = `${x}-${y}`;
                  const clicked = matrixClicks[key];
                  
                  // Generate custom cyber shades based on random weights
                  let tileColor = "bg-indigo-950/20";
                  if (clicked) tileColor = "bg-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.5)]";
                  else if (i % 7 === 0) tileColor = "bg-indigo-900/40 hover:bg-indigo-800/60";
                  else if (i % 5 === 0) tileColor = "bg-indigo-700/50 hover:bg-indigo-600/70";
                  else if (i % 3 === 0) tileColor = "bg-purple-950/30 hover:bg-purple-800/50";
                  else tileColor = "bg-slate-900/10 hover:bg-slate-800/30";

                  return (
                    <div
                      key={i}
                      onClick={() => handleCellClick(key)}
                      className={`aspect-square rounded-sm cursor-crosshair transition-all duration-300 ${tileColor}`}
                      title={`Cognitive Terminal Point: (${x}, ${y})`}
                    />
                  );
                })}
              </div>
              
              <div className="flex justify-between items-center mt-3 text-[9px] font-mono text-slate-500 px-1">
                <span>TERMINAL_X_0</span>
                <div className="flex items-center gap-1.5">
                  <span>COGNITIVELY IDLE</span>
                  <div className="w-2.5 h-2.5 rounded bg-indigo-950/20" />
                  <div className="w-2.5 h-2.5 rounded bg-indigo-900/40" />
                  <div className="w-2.5 h-2.5 rounded bg-indigo-700/50" />
                  <div className="w-2.5 h-2.5 rounded bg-cyan-400" />
                  <span>SYNAPSE SPARKED</span>
                </div>
                <span>TERMINAL_X_15</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: COACH PANEL & MILESTONES */}
        <div className="space-y-6">
          
          {/* CONVERSATIONAL AI COACH PANEL */}
          <div className="premium-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-white/5 bg-gradient-to-br from-indigo-950/15 via-black/40 to-slate-950">
            <div className="absolute top-0 right-0 p-4 text-[9px] font-mono text-indigo-500/10">COACH_IDLE</div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3.5 border-b border-white/5">
                <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">SkillBridge AI Agent</h3>
                  <p className="text-[9px] font-mono text-slate-400">COGNITIVE SYSTEM COACH</p>
                </div>
              </div>

              {/* Chat Bubble Interface */}
              <div className="space-y-3 font-mono text-[11px] leading-relaxed text-slate-300 bg-black/40 p-4 rounded-xl border border-white/5 min-h-[140px] text-left relative">
                <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-indigo-400 font-bold block mb-1">SYSTEM INSIGHT:</p>
                <p>
                  "Greetings, {profile?.name || "Student"}. I've synchronized your academic metrics. We are currently pacing a Placement Index of <b>{profile?.readiness_score || 50}%</b>."
                </p>
                {weakestSkill ? (
                  <p className="mt-2 text-cyan-400">
                    "ALERT: Competency gap discovered in your <b>{weakestSkill.name}</b> skill. Target module progress is currently at <b>{weakestSkill.progress}%</b>."
                  </p>
                ) : (
                  <p className="mt-2 text-indigo-300">
                    "Your technical skills roster is active. Generate personalized roadmaps to catalog intermediate levels."
                  </p>
                )}
                {roadmaps.length === 0 && (
                  <p className="mt-2 text-amber-400 font-semibold">
                    "RECOMMENDED ACTIONS: Trigger your autonomous AI syllabus generator now to establish pathways."
                  </p>
                )}
                <span className="inline-block h-3 w-1.5 bg-indigo-400 animate-pulse align-middle ml-1" />
              </div>

              {/* INTERACTIVE DAILY CHALLENGE (BOOSTER TASK) */}
              <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/15">
                      <Flame className="h-3 w-3" /> DAILY CHALLENGE
                    </span>
                    <p className="text-[11px] font-bold text-slate-200 mt-1">Refactor sandbox hooks & test memory limits</p>
                    <p className="text-[10px] text-slate-500">Reward: +10% temporary cognitive readiness boost</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={challengeCompleted}
                    onChange={(e) => {
                      setChallengeCompleted(e.target.checked);
                      if (e.target.checked) {
                        playSound(1300, "sine", 0.2);
                        toast.success("Daily challenge achieved! Diagnostic score upgraded.");
                      } else {
                        playSound(600, "sine", 0.1);
                      }
                    }}
                    className="rounded border-white/15 bg-black/40 text-cyan-400 h-4.5 w-4.5 cursor-pointer mt-0.5 focus:ring-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* INTERACTIVE ACADEMIC MILESTONES CHECKLIST */}
          <div className="premium-card rounded-2xl p-6 flex flex-col justify-between border border-white/5">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 mb-1 font-display">
                <CheckCircle2 className="h-4.5 w-4.5 text-indigo-400" /> Career Milestones Console
              </h3>
              <p className="text-xs text-slate-400 mb-5">Establish critical target gates to pass before active deployment.</p>

              {/* Add Goal Form */}
              <form onSubmit={handleAddGoal} className="flex gap-2 mb-5">
                <input
                  type="text"
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
                  placeholder="e.g. Host React cloud portfolio..."
                  disabled={goalLoading}
                />
                <button
                  type="submit"
                  disabled={goalLoading || !newGoalText.trim()}
                  className="p-2.5 bg-indigo-500 hover:bg-indigo-400 hover:scale-105 active:scale-95 disabled:opacity-40 text-white rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </form>

              {/* Checklist list */}
              <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin">
                {goals.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-600 font-mono">
                    No active milestone parameters set.
                  </div>
                ) : (
                  goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-xl hover:bg-white/[0.03] hover:border-white/10 transition-all text-xs"
                    >
                      <label className="flex items-center gap-3 cursor-pointer select-none truncate pr-2">
                        <input
                          type="checkbox"
                          checked={goal.completed}
                          onChange={(e) => handleToggleGoal(goal.id, e.target.checked)}
                          className="rounded border-white/15 bg-black/40 text-indigo-500 focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer"
                        />
                        <span className={`truncate text-slate-300 ${goal.completed ? "line-through text-slate-600" : ""}`}>
                          {goal.name}
                        </span>
                      </label>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-slate-600 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-all shrink-0 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM CHRONOLOGICAL EVENTS (Live activities) */}
      <div className="premium-card rounded-2xl p-6 border border-white/5 text-left">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-display">
              <Activity className="h-4.5 w-4.5 text-purple-400" /> SYSTEM ACTIVITY LOGS
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Chronological system events and diagnostic integrations.</p>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase">SYS_LOG_INTELLIGENCE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-indigo-500/20 hover:bg-white/[0.02] transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <FileSearch className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-200">ATS Resume Scan Synced</p>
                <p className="text-[10px] text-slate-500">Detected candidate category matching index: {atsScore ? `${atsScore}%` : "Pending"}</p>
                <span className="text-[9px] font-mono text-slate-600 block pt-1.5">2026-07-09 // LOG POINT #23</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-purple-500/20 hover:bg-white/[0.02] transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                <Map className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-200">Autonomous Syllabi Synced</p>
                <p className="text-[10px] text-slate-500">{roadmaps.length} custom AI blueprints registered for profile</p>
                <span className="text-[9px] font-mono text-slate-600 block pt-1.5">2026-07-09 // LOG POINT #22</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-cyan-500/20 hover:bg-white/[0.02] transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                <Award className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-200">Industrial Screening Evaluation</p>
                <p className="text-[10px] text-slate-500">Interview prep scorecard synced: {lastInterviewScore ? `${lastInterviewScore}/100` : "Awaiting prep"}</p>
                <span className="text-[9px] font-mono text-slate-600 block pt-1.5">2026-07-09 // LOG POINT #21</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS HUD OVERLAY BAR */}
      <div className="premium-card rounded-2xl p-6 border border-white/5">
        <h3 className="text-base font-bold text-white tracking-tight mb-5 font-display flex items-center gap-2">
          <Sliders className="h-4.5 w-4.5 text-cyan-400" /> SYSTEM FAST-TRAVEL TELEPORTALS
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link
            to="/skills"
            className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.03] transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
          >
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:scale-110 transition-transform">
              <Code className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white font-sans">Skills Matrix</span>
          </Link>

          <Link
            to="/projects"
            className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.03] transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
          >
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:scale-110 transition-transform">
              <FolderGit2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white font-sans">Project Vault</span>
          </Link>

          <Link
            to="/roadmap"
            className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.03] transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
          >
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:scale-110 transition-transform">
              <Map className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white font-sans">AI Syllabi</span>
          </Link>

          <Link
            to="/resume"
            className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.03] transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
          >
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg group-hover:scale-110 transition-transform">
              <FileSearch className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white font-sans">Resume ATS</span>
          </Link>

          <Link
            to="/analytics"
            className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-amber-500/30 hover:bg-white/[0.03] transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer col-span-2 sm:col-span-1"
          >
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg group-hover:scale-110 transition-transform">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white font-sans">Growth Hub</span>
          </Link>
        </div>
      </div>

      {/* DYNAMIC OS COMPILER MODAL REPORT POPUP */}
      <AnimatePresence>
        {isCompilingReport && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-2xl w-full premium-card p-8 rounded-3xl border border-indigo-500/30 bg-slate-950/95 shadow-[0_0_60px_rgba(99,102,241,0.3)] relative text-left"
            >
              <div className="absolute right-6 top-6">
                <button
                  onClick={() => setIsCompilingReport(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white text-xs cursor-pointer font-bold font-mono transition-colors"
                >
                  CLOSE_OS
                </button>
              </div>

              <div className="flex items-center gap-3.5 pb-5 border-b border-white/5 mb-6">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                  <Brain className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">OS Telemetry Executive Report</h3>
                  <p className="text-xs text-slate-400 font-mono">NEURAL DATA GENERATION ENGINE</p>
                </div>
              </div>

              {/* Progress Bar */}
              {compilationProgress < 100 ? (
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-indigo-400 font-bold uppercase tracking-wider">Compiling Portfolio parameters ...</span>
                    <span className="text-white font-black">{compilationProgress}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 transition-all duration-300" style={{ width: `${compilationProgress}%` }} />
                  </div>
                  
                  {/* Compilation terminal logs */}
                  <div className="p-4 bg-black border border-white/5 rounded-2xl max-h-[160px] overflow-y-auto scrollbar-thin space-y-1">
                    {compilationLogs.map((log, i) => (
                      <p key={i} className="text-[10px] font-mono text-emerald-400 leading-relaxed">{log}</p>
                    ))}
                    <span className="inline-block h-3.5 w-2 bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              ) : (
                /* Report Presentation */
                compiledReport && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-left">
                        <span className="text-[9px] font-mono text-indigo-400 block mb-1">PLACEMENT GRADIENT</span>
                        <p className="text-2xl font-black text-white font-display">{compiledReport.grade}</p>
                      </div>
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-left">
                        <span className="text-[9px] font-mono text-purple-400 block mb-1">AVERAGE ESTIMATED SALARY</span>
                        <p className="text-2xl font-black text-white font-display">${compiledReport.salary}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <span className="text-[9px] font-mono text-cyan-400 block mb-1.5">OPTIMAL STACK TARGET</span>
                      <p className="text-xs font-bold text-white font-mono">{compiledReport.optimalStack}</p>
                    </div>

                    {/* Skill Gaps recommendations */}
                    <div className="p-4 bg-red-500/[0.02] border border-red-500/10 rounded-2xl">
                      <span className="text-[9px] font-mono text-red-400 block mb-1.5 uppercase font-bold tracking-widest">CRITICAL TECH GAPS IDENTIFIED</span>
                      <div className="flex flex-wrap gap-2">
                        {compiledReport.gaps.map((gap: string, i: number) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-300">
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* OS Achievements lists */}
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-left">
                      <span className="text-[9px] font-mono text-emerald-400 block mb-2 uppercase font-bold tracking-wider">EMITTED PORTFOLIO ACHIEVEMENTS</span>
                      <ul className="space-y-1.5">
                        {compiledReport.achievements.map((item: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => {
                          playSound(900, "sine", 0.1);
                          window.print();
                        }}
                        className="px-4 py-2 text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl transition-all mr-2 cursor-pointer"
                      >
                        PRINT_DIAGNOSTICS
                      </button>
                      <button
                        onClick={() => setIsCompilingReport(false)}
                        className="px-4 py-2 text-xs font-mono bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                      >
                        CLOSE_TELEMETRY
                      </button>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
