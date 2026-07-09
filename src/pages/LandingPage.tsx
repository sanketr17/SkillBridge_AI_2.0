import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldCheck,
  Zap,
  Star,
  Users,
  Briefcase,
  CheckCircle,
  CheckCircle2,
  FileCode,
  Globe,
  Database,
  Lock,
  MessageSquare,
  Cpu,
  Tv,
  Check,
  Terminal,
  Activity,
  Sliders,
  ChevronRight,
  Play,
  Award,
  Clock,
  FileSearch,
  Laptop,
  ArrowUpRight,
  Search,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { AICore } from "../components/ui/AICore";
import Ambient3DBackground from "../components/ui/Ambient3DBackground";

// Standard brand companies list for infinite marquee
const COMPANIES = [
  { name: "Stripe", icon: <Globe className="h-4 w-4" /> },
  { name: "OpenAI", icon: <Brain className="h-4 w-4" /> },
  { name: "Vercel", icon: <Cpu className="h-4 w-4" /> },
  { name: "Framer", icon: <Sliders className="h-4 w-4" /> },
  { name: "Linear", icon: <Activity className="h-4 w-4" /> },
  { name: "Supabase", icon: <Database className="h-4 w-4" /> },
  { name: "Notion AI", icon: <Sparkles className="h-4 w-4" /> },
  { name: "Figma", icon: <Laptop className="h-4 w-4" /> }
];

export const LandingPage: React.FC = () => {
  // Navigation active overlay scroll state
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sound Synth Generator (Web Audio API for UI sensory feedback)
  const playSound = (freq = 800, type: OscillatorType = "sine", duration = 0.08, volume = 0.02) => {
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
      // Audio engine is blocked or requires manual interaction
    }
  };

  // State management for Interactive Showcase Simulator
  const [activeTab, setActiveTab] = useState<"roadmap" | "resume" | "interview" | "analytics">("roadmap");

  // State for Resume Simulation
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [simulatedAtsScore, setSimulatedAtsScore] = useState(38);

  // State for Interview Simulation
  const [interviewQuestionIndex, setInterviewQuestionIndex] = useState(0);
  const [interviewScore, setInterviewScore] = useState<number | null>(null);
  const [interviewFeedback, setInterviewFeedback] = useState("");

  const runResumeSimulation = () => {
    if (isScanning) return;
    playSound(440, "sawtooth", 0.2, 0.02);
    setIsScanning(true);
    setScanStep(1);
    setSimulatedAtsScore(38);

    const steps = [
      "Decompiling PDF Structure...",
      "OCR Text Node Extraction...",
      "Matching Key Technical Verbs...",
      "Detecting Database Routing Gaps...",
      "Compiling Industry Readiness Index..."
    ];

    let currentStep = 1;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setScanStep(currentStep + 1);
        playSound(600 + currentStep * 80, "sine", 0.04, 0.015);
        currentStep++;
      } else {
        clearInterval(interval);
        setSimulatedAtsScore(89);
        setIsScanning(false);
        playSound(1000, "triangle", 0.3, 0.03);
      }
    }, 700);
  };

  const answerInterviewQuestion = (score: number, responseText: string) => {
    playSound(900, "sine", 0.1, 0.02);
    setInterviewScore(score);
    if (score >= 90) {
      setInterviewFeedback("EXCELLENT! This answer employs strong action verbs and shows clear architecture expertise.");
    } else if (score >= 70) {
      setInterviewFeedback("GOOD. Solid conceptual framework, but could use more quantitative metrics to back it up.");
    } else {
      setInterviewFeedback("WARNING. Missing key industrial keywords and architectural definitions. Let's practice.");
    }
  };

  // State for FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What makes SkillBridge AI different from traditional university career portals?",
      a: "SkillBridge AI bridges academic concepts with industrial reality. Instead of hosting flat, stale job postings, we utilize advanced language and vision models to generate custom training roadmaps, analyze resumes against modern production standards, and run simulated technical coding interviews evaluated by AI."
    },
    {
      q: "Do I have to connect a real backend or Supabase database?",
      a: "No! SkillBridge operates seamlessly out-of-the-box using an automated high-performance client-side LocalDb sandbox system. For advanced persistence, you can bind your custom cloud database credentials in seconds."
    },
    {
      q: "Is the ATS resume analyzer actually reading our PDF files?",
      a: "Yes! Using advanced client-side vision OCR algorithms, our engine reads structure and checks your skills, format compliance, and metrics, then spits out a direct readiness score with custom recommendations."
    },
    {
      q: "Are the mock interview screens graded by actual AI models?",
      a: "Absolutely. The system triggers advanced conversational APIs to assess syntax complexity, behavioral milestones, and technical problem-solving. It then produces a precise industrial scorecard for each trial."
    }
  ];

  return (
    <div className="bg-[#02040a] text-slate-100 min-h-screen overflow-x-hidden font-sans select-none relative selection:bg-indigo-500/30 selection:text-white">
      
      {/* Noise Grain Layer */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz4KPC9zdmc+')] opacity-40 pointer-events-none z-40" />

      {/* Futuristic Kinetic Aura Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft floating dynamic backdrops */}
        <div className="absolute top-[-10%] left-[-20%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full filter blur-[160px] animate-pulse duration-10000" />
        <div className="absolute top-[30%] right-[-10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full filter blur-[150px] animate-pulse duration-7000" />
        <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-cyan-600/5 rounded-full filter blur-[130px]" />
        
        {/* Fine Digital Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-70" />

        {/* Ambient 3D Rotating Geometries */}
        <Ambient3DBackground />
      </div>

      {/* Floating Header Console */}
      <header className={`sticky top-0 z-50 transition-all duration-500 border-b ${scrolled ? "bg-black/60 backdrop-blur-2xl py-3 border-white/5" : "bg-transparent py-5 border-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4.5 min-w-max overflow-visible select-none cursor-pointer group/brand" onClick={() => playSound(520, "sine", 0.08)}>
            <div className="relative flex items-center justify-center h-12 w-12 bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover/brand:shadow-[0_0_30px_rgba(168,85,247,0.5)] group-hover/brand:scale-[1.04] transition-all duration-500 ease-out flex-shrink-0">
              <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
              <GraduationCap className="h-6.5 w-6.5 relative z-10 flex-shrink-0" />
              {/* Micro Neon Pulse Badge */}
              <div className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-slate-950 flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col text-left justify-center whitespace-nowrap min-w-max flex-shrink-0 overflow-visible">
              <span className="font-display font-extrabold text-white text-base md:text-lg tracking-normal leading-none">
                SkillBridge AI
              </span>
              <span className="text-[10px] md:text-[11px] text-slate-400/80 font-medium tracking-[0.12em] uppercase font-sans mt-1.5 leading-none">
                Industry Ready Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-xs font-semibold font-mono tracking-wider text-slate-400 hover:text-white uppercase transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => playSound(880, "triangle", 0.15)}
              className="px-4 py-2.5 text-[10px] font-bold font-mono tracking-widest uppercase text-slate-950 bg-white hover:bg-slate-100 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300"
            >
              Access System
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 max-w-7xl mx-auto z-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Key Copy & Systems Badges */}
          <div className="lg:col-span-7 space-y-8 flex flex-col items-start">
            
            {/* Sparkle Banner */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 font-mono font-bold uppercase tracking-widest shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md hover:border-indigo-500/40 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              <span>THE COGNITIVE PLACEMENT ENGINE</span>
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
            </motion.div>

            {/* Title */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05] font-display"
              >
                Fresh Graduates:<br />
                Accelerate Your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 text-glow">
                  Industry Readiness
                </span>
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl font-sans"
            >
              Academic models teach theory. SkillBridge AI builds competitive software engineers. 
              Unlock custom weekly training paths, track production code commits, and master simulated technical coding interviews graded by advanced intelligence models.
            </motion.p>

            {/* Telemetry Matrix status cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2.5 pt-2"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/5 shadow-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">AI Coach Online</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/5 shadow-md">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Vision ATS Active</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/5 shadow-md">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Mock Interview Engine</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2"
            >
              <Link
                to="/register"
                onClick={() => playSound(1000, "triangle", 0.15)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white rounded-xl font-bold text-xs inline-flex items-center justify-center gap-3 shadow-[0_12px_35px_rgba(99,102,241,0.25)] hover:shadow-[0_15px_45px_rgba(99,102,241,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 border border-white/10 tracking-widest uppercase font-mono"
              >
                Launch Academic Console <ArrowRight className="h-4 w-4 animate-pulse" />
              </Link>
              
              <Link
                to="/login"
                onClick={() => playSound(650, "sine", 0.08)}
                className="px-8 py-4 bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 rounded-xl text-slate-200 hover:text-white font-bold text-xs inline-flex items-center justify-center gap-3 backdrop-blur-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 tracking-widest uppercase font-mono"
              >
                Explore Sandbox Mode
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Holographic AI Core Sphere Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 w-full flex justify-center relative"
          >
            {/* Holographic scanner laser line decoration */}
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_12px_rgba(6,182,212,0.8)] z-30 pointer-events-none animate-[bounce_6s_infinite]" />
            
            {/* Ambient Backlight halo behind AICore */}
            <div className="absolute inset-4 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
            
            <div className="p-4 rounded-3xl bg-black/40 border border-white/10 shadow-2xl backdrop-blur-2xl relative w-full max-w-lg">
              <AICore />
              
              {/* Telemetry metadata decorations inside AICore card */}
              <div className="absolute top-4 left-4 font-mono text-[8px] text-indigo-400/60 uppercase tracking-widest">
                SYS_CORE_SPHERE // CHIP_7X2
              </div>
              <div className="absolute bottom-4 right-4 font-mono text-[8px] text-cyan-400/60 uppercase tracking-widest">
                FPS: 60 // RATIO: STABLE
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Infinite Logo Marquee */}
      <section className="py-10 border-y border-white/5 bg-slate-950/40 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-6">
            ALIGNED CAREER TELEPORTALS FOR LEADING TEAMS
          </p>
          
          <div className="relative flex overflow-x-hidden">
            <div className="animate-marquee flex gap-12 whitespace-nowrap py-2">
              {COMPANIES.concat(COMPANIES).map((company, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors duration-300 cursor-pointer"
                  onClick={() => playSound(600 + index * 30, "sine", 0.05, 0.01)}
                >
                  {company.icon}
                  <span className="font-mono text-sm font-semibold tracking-wider uppercase">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE LIVE INTERACTIVE PLAYGROUND (The "WOW" Simulator Module) */}
      <section className="py-28 px-6 max-w-7xl mx-auto relative z-10 text-left">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase font-mono bg-cyan-400/10 px-3 py-1.5 rounded-full border border-cyan-400/20">
            Interactive Sandbox Simulator
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-4 font-display">
            Test Drive Our AI Core Right Now
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed font-sans">
            Experiment with a real live simulation of the SkillBridge workspace engine. Select an operational node below to trigger AI diagnostics.
          </p>
        </div>

        {/* Dynamic Glass Control Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls tabs (Left) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <button
              onClick={() => {
                setActiveTab("roadmap");
                playSound(600, "sine", 0.08);
              }}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${activeTab === "roadmap" ? "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03]"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeTab === "roadmap" ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-slate-400"}`}>
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">1. Autonomous Roadmaps</h4>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">Custom week-by-week curriculum maps</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab("resume");
                playSound(700, "sine", 0.08);
              }}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${activeTab === "resume" ? "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03]"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeTab === "resume" ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-slate-400"}`}>
                  <FileSearch className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">2. ATS Resume Scanner</h4>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">Vision OCR compliance checks</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab("interview");
                playSound(800, "sine", 0.08);
              }}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${activeTab === "interview" ? "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03]"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeTab === "interview" ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-slate-400"}`}>
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">3. Technical Screenings</h4>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">Simulated model feedback</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab("analytics");
                playSound(900, "sine", 0.08);
              }}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${activeTab === "analytics" ? "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03]"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeTab === "analytics" ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-slate-400"}`}>
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">4. Performance Telemetry</h4>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">Continuous readiness indicators</p>
                </div>
              </div>
            </button>
          </div>

          {/* Interactive Screen Display (Right) */}
          <div className="lg:col-span-8 p-6 md:p-8 rounded-2xl bg-[#030712]/50 border border-white/10 backdrop-blur-2xl flex flex-col justify-between shadow-2xl relative min-h-[380px]">
            {/* Upper browser wireframe dots */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                <span className="text-[9px] font-mono text-slate-600 ml-4">SKILLBRIDGE_SIMULATOR://ACTIVE_MODULE</span>
              </div>
              <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20 font-bold">
                {activeTab.toUpperCase()}
              </span>
            </div>

            {/* Simulated Content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {activeTab === "roadmap" && (
                  <motion.div
                    key="roadmap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 text-left"
                  >
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <h5 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono text-indigo-400">
                        TARGET: Front-End Systems Architect
                      </h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">Syllabus generated successfully inside LocalDb.</p>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span className="text-xs text-slate-300">Week 1: TypeScript Static Type Systems & Generics</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500">100% DONE</span>
                      </div>

                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 animate-pulse" />
                          <span className="text-xs text-slate-300">Week 2: React Server Components & Suspense Streaming</span>
                        </div>
                        <span className="text-[9px] font-mono text-indigo-400 font-bold animate-pulse">ACTIVE TARGET</span>
                      </div>

                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg flex items-center justify-between opacity-55">
                        <div className="flex items-center gap-3">
                          <span className="h-4 w-4 rounded-full border border-slate-600 block shrink-0" />
                          <span className="text-xs text-slate-300">Week 3: Advanced CI/CD Integration & Monorepos</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500">LOCKED</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "resume" && (
                  <motion.div
                    key="resume"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 text-left"
                  >
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex-1 w-full">
                        <span className="text-[9px] font-mono text-slate-500 uppercase">Uploaded Document</span>
                        <p className="text-xs font-bold text-slate-200 mt-1">candidate_alex_resume_v4.pdf</p>
                        <p className="text-[10px] text-slate-500">142 KB &bull; PDF Document format</p>
                      </div>

                      <button
                        onClick={runResumeSimulation}
                        disabled={isScanning}
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-lg disabled:opacity-50 shrink-0 w-full md:w-auto hover:scale-102 transition-transform cursor-pointer"
                      >
                        {isScanning ? "Scanning PDF..." : "Trigger AI Scanner"}
                      </button>
                    </div>

                    {isScanning ? (
                      <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-mono text-indigo-300">
                          <span>OCR LASER INTERACTIVE DISCOVERY:</span>
                          <span className="animate-pulse">STEP {scanStep}/5</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-400 transition-all duration-300" style={{ width: `${scanStep * 20}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                          <span className="text-[10px] font-mono text-slate-500">ATS INDEX PERFORMANCE</span>
                          <p className="text-3xl font-extrabold text-white mt-1">{simulatedAtsScore}%</p>
                          <span className="text-[9px] text-emerald-400 font-mono">
                            {simulatedAtsScore >= 80 ? "✔ PASSED BASIC SCREEN" : "▲ BELOW INDUSTRIAL MEDIAN"}
                          </span>
                        </div>
                        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                          <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Recommended action:</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                            {simulatedAtsScore >= 80 
                              ? "Excellent. Strengthen Docker & cloud clustering credentials to unlock alpha tiers." 
                              : "OCR flagged missing Next.js transactional routing metrics. Trigger re-scan."}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "interview" && (
                  <motion.div
                    key="interview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 text-left"
                  >
                    <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5">
                      <span className="text-[9px] font-mono text-purple-400 uppercase font-black tracking-widest">Grading Model Check</span>
                      <p className="text-xs font-semibold text-slate-200 mt-1">
                        "How do you optimize state rendering performance across heavy React lists?"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      <button
                        onClick={() => answerInterviewQuestion(45, "I consolidate the entire page logic into one main useState hook.")}
                        className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-left text-xs text-slate-300 font-mono transition-colors cursor-pointer"
                      >
                        Option A: "Use massive central state hooks."
                      </button>
                      <button
                        onClick={() => answerInterviewQuestion(95, "I implement virtualized window arrays, usePrimitive triggers, and memoize list items.")}
                        className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-left text-xs text-slate-300 font-mono transition-colors cursor-pointer"
                      >
                        Option B: "Virtualized viewport rendering."
                      </button>
                    </div>

                    {interviewScore !== null && (
                      <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-400">EVALUATION MODEL SCORE:</span>
                          <span className={interviewScore >= 80 ? "text-emerald-400" : "text-amber-400"}>
                            {interviewScore}/100 POINTS
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 italic">"{interviewFeedback}"</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "analytics" && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 text-left"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                        <span className="text-[9px] font-mono text-slate-500 block">Neural Readiness index</span>
                        <span className="text-2xl font-black text-white mt-1 block">82%</span>
                        <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/10 mt-1 inline-block">
                          OPTIMAL GROWTH
                        </span>
                      </div>

                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                        <span className="text-[9px] font-mono text-slate-500 block">Placement Factor</span>
                        <span className="text-2xl font-black text-indigo-400 mt-1 block">High Probability</span>
                        <span className="text-[8px] font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded-full border border-indigo-500/10 mt-1 inline-block">
                          ALIGNED WITH STRIPE
                        </span>
                      </div>

                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                        <span className="text-[9px] font-mono text-slate-500 block">Completed Modules</span>
                        <span className="text-2xl font-black text-cyan-400 mt-1 block">12 units</span>
                        <span className="text-[8px] font-mono text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded-full border border-cyan-500/10 mt-1 inline-block">
                          EXHAUSTED SYLLABUS
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Simulated Live status logs at bottom */}
            <div className="border-t border-white/5 pt-4 mt-6 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>SANDBOX SIMULATION ACTIVE</span>
              </div>
              <span>COGNITIVE MATRIX SYNC SECURE // 2026-07-09</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase: Detailed breakdown of the core systems */}
      <section className="py-28 px-6 max-w-7xl mx-auto relative z-10 text-left">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase font-mono bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
            A Closer Look
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-4 font-display">
            Engineered for Industrial Output
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed font-sans">
            Every section of SkillBridge is finely tuned to replace normal CRUD mechanics with intelligent career milestones.
          </p>
        </div>

        {/* Feature Node 1: Alternating details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32">
          <div className="lg:col-span-6 space-y-6">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit">
              <Brain className="h-5 w-5 animate-pulse" />
            </div>
            <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-display">
              Autonomous Dynamic Roadmaps
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              Enter any technical role configuration. Our background language models instantly generate a tailored, multi-week progress curriculum. Each milestone is packed with practical checklist items, and links to recommended document structures.
            </p>
            <div className="space-y-3.5 pt-2 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
                <span>Dynamic real-time generation customized for specific enterprise tiers</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
                <span>Track completion statistics and automatically raise core placement parameters</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-white/[0.01] border border-white/5 relative group overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-36 h-36 bg-indigo-500/10 rounded-full filter blur-2xl opacity-40" />
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4 font-mono text-[9px] text-slate-500">
              <span>PATHWAY GENERATION CORE</span>
              <span className="text-indigo-400">SYNC_OK</span>
            </div>
            
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-[#030712]/60 border border-white/5 text-left">
                <span className="text-[10px] font-mono text-indigo-400 font-bold block">WEEK 1: ADVANCED MEMORY HOOKS</span>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  Define complex useRef coordinates, establish primitive dependency arrays, and avoid infinite re-render loops.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#030712]/60 border border-white/5 text-left opacity-60">
                <span className="text-[10px] font-mono text-slate-500 block">WEEK 2: WORKSPACE OAUTH SECURITY</span>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  Manage third-party cookie restrictions inside sandboxed browser contexts and configure rigid redirect flows.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Node 2: Document Scanner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32">
          
          {/* Mockup Left */}
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl w-fit">
              <FileSearch className="h-5 w-5" />
            </div>
            <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-display">
              OCR Resume Critiques & Vision OCR
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              Don't guess what hiring managers or automated parsers see. Our advanced scanner reads uploaded documents, compiles structural failures, flags weak operational verbs, and rates candidate profiles against industry benchmarks instantly.
            </p>
            <div className="space-y-3.5 pt-2 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0" />
                <span>Extract full OCR text structures in seconds with zero server lag</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0" />
                <span>Direct recommendations to replace descriptive statements with impact-driven stats</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-white/[0.01] border border-white/5 relative group overflow-hidden lg:order-1">
            <div className="absolute bottom-[-10%] left-[-10%] w-36 h-36 bg-purple-500/10 rounded-full filter blur-2xl opacity-40" />
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4 font-mono text-[9px] text-slate-500">
              <span>DOCUMENT OCR NODE</span>
              <span className="text-purple-400">SCAN_SUCCESS</span>
            </div>

            <div className="space-y-3.5">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-left">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-200">ATS compliance meter</span>
                  <span className="text-xs text-purple-400 font-bold font-mono">81% SCORE</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-purple-400" style={{ width: "81%" }} />
                </div>
              </div>

              <div className="p-4 bg-[#030712]/40 border border-white/5 rounded-xl text-left space-y-1.5">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Structural Gaps Found:</span>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  "No database pipeline optimization listed. Consider detailing specific PostgreSQL or Redis middleware layers."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Node 3: Mock interview screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl w-fit">
              <Sliders className="h-5 w-5" />
            </div>
            <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-display">
              Technical & STAR Interview Preps
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              Get comfortable under pressure. Practice answering realistic coding questions, architectural system challenges, and critical behavioral parameters evaluated by advanced language models. Receive immediate scorecards, custom corrections, and insights.
            </p>
            <div className="space-y-3.5 pt-2 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" />
                <span>Simulated interactive screens with realistic technical prompts</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" />
                <span>Deep analysis of logic flow, syntax correctness, and STAR framework milestones</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-white/[0.01] border border-white/5 relative group overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-36 h-36 bg-cyan-500/10 rounded-full filter blur-2xl opacity-40" />
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4 font-mono text-[9px] text-slate-500">
              <span>INTERVIEW EVALUATOR CONSOLE</span>
              <span className="text-cyan-400">GRADE_LOGGED</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-left">
                <span className="text-[10px] font-mono text-slate-500 block">AI COACH RESPONSE CRITIQUE:</span>
                <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
                  "Your answer starts strong by using virtualized scrolling definitions, but lacks mention of cache invalidation keys."
                </p>
              </div>

              <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl text-left flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">EVALUATION METRIC</span>
                  <span className="text-sm font-bold text-slate-200">STAR Architecture</span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                  92/100 PTS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Graduate Success Testimonials */}
      <section className="py-28 px-6 max-w-7xl mx-auto relative z-10 text-left">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase font-mono bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-4 font-display">
            Placed at Elite Engineering Teams
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed font-sans">
            Hear from recent graduates who bypassed traditional academic stagnancy and accelerated straight into modern SaaS teams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 relative flex flex-col justify-between hover:border-indigo-500/30 transition-colors group">
            <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-indigo-400/20">TESTIMONIAL_01</div>
            
            <p className="text-slate-300 italic text-sm leading-relaxed font-sans">
              " SkillBridge AI completely turned my conceptual degree into high-yield practical capital. The custom week-by-week roadmaps helped me master TypeScript interfaces and secure Supabase API partitions in weeks. I aced my technical evaluations and signed a role at Stripe! "
            </p>
            
            <div className="flex items-center gap-3.5 mt-8 pt-6 border-t border-white/5">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-cyan-400 font-mono">
                AL
              </div>
              <div>
                <h5 className="text-sm font-semibold text-white font-sans">Alex Liang</h5>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">State College '25 &bull; Placed at Stripe</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 relative flex flex-col justify-between hover:border-purple-500/30 transition-colors group">
            <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-purple-400/20">TESTIMONIAL_02</div>
            
            <p className="text-slate-300 italic text-sm leading-relaxed font-sans">
              " The document scanner was an eye opener. The model explicitly checked my resume layouts and warned that my bullet points were too descriptive rather than impact-focused. I adjusted my text structures, finished 3 sandbox projects, and got placed at Vercel! "
            </p>

            <div className="flex items-center gap-3.5 mt-8 pt-6 border-t border-white/5">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-xs text-purple-400 font-mono">
                MP
              </div>
              <div>
                <h5 className="text-sm font-semibold text-white font-sans">Maya Patel</h5>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">State Tech '26 &bull; Placed at Vercel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (The Career Investment Tier) */}
      <section className="py-28 px-6 max-w-7xl mx-auto relative z-10 text-left">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase font-mono bg-cyan-400/10 px-3 py-1.5 rounded-full border border-cyan-400/20">
            Subscription Matrix
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-4 font-display">
            Simple, High-Yield Plans
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed font-sans">
            Connect your own cloud parameters, or experiment for free. Accelerate your roadmap metrics with no strings attached.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Plan 1 */}
          <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 relative flex flex-col justify-between group hover:border-white/10 transition-colors">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">CORE ACCESS</span>
                <h4 className="text-2xl font-bold text-white font-display">Sandbox Free Core</h4>
                <p className="text-xs text-slate-500">Fully capable environment operating inside LocalDb.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white font-display">$0</span>
                <span className="text-xs text-slate-500 font-mono">/ FOREVER FREE</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5 font-sans text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Unlimited Sandbox LocalDb entries</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Interactive Week-by-Week Roadmap structures</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Simulated STAR and technical preps</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                to="/register"
                onClick={() => playSound(1000, "triangle", 0.15)}
                className="w-full text-center px-6 py-3.5 bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] rounded-xl text-xs font-bold font-mono tracking-wider uppercase text-slate-200 block transition-colors"
              >
                Access System
              </Link>
            </div>
          </div>

          {/* Plan 2 */}
          <div className="p-8 rounded-2xl bg-indigo-500/[0.02] border border-indigo-500/20 relative flex flex-col justify-between group shadow-xl shadow-indigo-500/[0.01]">
            {/* Highlight bubble */}
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-mono font-bold text-indigo-400">
              RECOMMENDED NODE
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">ADVANCED MATRIX</span>
                <h4 className="text-2xl font-bold text-white font-display">Enterprise Ready Elite</h4>
                <p className="text-xs text-indigo-300">Unleash real-time Supabase configurations and AI scoring.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white font-display">$19</span>
                <span className="text-xs text-slate-400 font-mono">/ BILLY MONTHLY</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5 font-sans text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Real Supabase live syncing for portfolios</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Direct OCR vision scan triggers for resumes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Unlimited model validations & scoring history logs</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                to="/register"
                onClick={() => playSound(1200, "sine", 0.2, 0.04)}
                className="w-full text-center px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 rounded-xl text-xs font-bold font-mono tracking-wider uppercase text-white block transition-all shadow-lg shadow-indigo-500/10 border border-white/10 hover:scale-[1.01]"
              >
                Launch Professional Console
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Accordion */}
      <section className="py-28 px-6 max-w-4xl mx-auto relative z-10 text-left">
        <div className="text-center mb-16">
          <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase font-mono bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
            FAQ CONSOLE
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-4 font-display">
            Common Inquiries
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => {
                    playSound(isOpen ? 600 : 800, "sine", 0.05, 0.015);
                    setOpenFaq(isOpen ? null : index);
                  }}
                  className="w-full p-5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-90 text-indigo-400" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/[0.02] font-sans">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Cinematic Call to Action */}
      <section className="bg-gradient-to-b from-slate-950/80 to-[#030712] py-28 px-6 border-t border-white/5 relative z-10 text-center overflow-hidden">
        {/* Floating backdrop lamp orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full filter blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight text-white font-display">
            Ready to Bridge the Career Gap?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed font-sans">
            Launch your custom syllabus matrix, track performance indicators, and unlock optimal industry readiness factors right inside your browser in minutes.
          </p>
          <div className="pt-4">
            <Link
              to="/register"
              onClick={() => playSound(1000, "triangle", 0.15)}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white rounded-xl font-bold text-xs inline-flex items-center gap-3.5 hover:shadow-[0_8px_40px_rgba(99,102,241,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 border border-white/10 tracking-widest uppercase font-mono"
            >
              Start Free Training <ArrowRight className="h-4 w-4 animate-bounce" />
            </Link>
          </div>
        </div>
      </section>

      {/* Massive World-Class Footer */}
      <footer className="border-t border-white/5 bg-[#030712] px-6 md:px-12 py-16 text-left text-xs text-slate-600 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Logo Brand Info */}
          <div className="space-y-4 overflow-visible">
            <div className="flex items-center gap-4 min-w-max overflow-visible select-none group/brand">
              <div className="relative flex items-center justify-center h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 flex-shrink-0">
                <GraduationCap className="h-5.5 w-5.5 relative z-10 flex-shrink-0" />
              </div>
              <div className="flex flex-col text-left justify-center whitespace-nowrap min-w-max flex-shrink-0 overflow-visible">
                <span className="font-display font-extrabold text-slate-200 text-sm tracking-normal leading-none">
                  SkillBridge AI
                </span>
                <span className="text-[9px] text-slate-500 font-medium tracking-[0.1em] uppercase font-sans mt-1 leading-none">
                  Industry Ready Platform
                </span>
              </div>
            </div>
            <p className="text-slate-500 leading-relaxed font-sans">
              Accelerating academic excellence into practical high-yield capital for competitive software engineers worldwide.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-3.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black block">System</span>
            <ul className="space-y-2 font-sans text-slate-500 text-xs">
              <li>
                <Link to="/skills" className="hover:text-indigo-400 transition-colors">Skills Core</Link>
              </li>
              <li>
                <Link to="/roadmap" className="hover:text-indigo-400 transition-colors">Autonomous Pathways</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-indigo-400 transition-colors">SaaS Portfolios</Link>
              </li>
              <li>
                <Link to="/resume" className="hover:text-indigo-400 transition-colors">Resume OCR Critique</Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-3.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black block">Academy</span>
            <ul className="space-y-2 font-sans text-slate-500 text-xs">
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">Sign In Portal</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition-colors">Create Account</Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-indigo-400 transition-colors">System Support FAQ</a>
              </li>
              <li>
                <span className="text-slate-600 italic">Documentation v2.0 (Live)</span>
              </li>
            </ul>
          </div>

          {/* Admin / Core specifications */}
          <div className="space-y-3.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black block">Telemetry</span>
            <p className="text-slate-500 leading-relaxed font-sans">
              Contact diagnostic administrators at:
            </p>
            <p className="font-mono text-[10px] text-slate-400 bg-white/5 px-2.5 py-1.5 rounded border border-white/5 w-fit">
              sanketr980@gmail.com
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
          <p className="font-sans">SkillBridge AI &bull; Bridging Academia and Industry &bull; Copyright &copy; 2026</p>
          <div className="flex gap-4 font-mono text-[10px] text-slate-600">
            <span>SECURE CHANNEL TLS 1.3</span>
            <span>//</span>
            <span>SYSTEM PULSE CALIBRATED</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
