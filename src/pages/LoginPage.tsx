import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, ArrowRight, ArrowLeft, Sparkles, Shield, Cpu, Activity, Database, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "motion/react";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const { login, resetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Futuristic boot-up sequence states
  const [isInitialized, setIsInitialized] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootText, setBootText] = useState("Initializing AI Engine...");

  // Canvas ref for the 3D Holographic Brain Core
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    // Progress boot-up sequence beautifully in 2.2 seconds
    const bootSteps = [
      { progress: 15, text: "Initializing AI Cognitive Engine..." },
      { progress: 35, text: "Connecting Secure Cloud Sandbox Workspace..." },
      { progress: 55, text: "Loading Neural Skill-Mapping Modules..." },
      { progress: 75, text: "Stabilizing Interactive Resume Parsing Vector Database..." },
      { progress: 90, text: "Synchronizing Real-time Mock Interview Engines..." },
      { progress: 100, text: "Cognitive Security Gateways fully operational." }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < bootSteps.length) {
        const step = bootSteps[currentStepIdx];
        setBootProgress(step.progress);
        setBootText(step.text);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsInitialized(true), 400);
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  // Real-time 3D Interactive Core Graphics Canvas
  useEffect(() => {
    if (!isInitialized) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    // Track mouse coordinates for immersive interactive parallax/magnetic rotation
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left - width / 2;
      mouseRef.current.targetY = e.clientY - rect.top - height / 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 500;
      height = canvas.height = canvas.parentElement?.clientHeight || 500;
    };
    window.addEventListener("resize", handleResize);

    // Create a spectacular 3D glowing particle mesh representing AI Neural pathways
    interface Node3D {
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      color: string;
      size: number;
    }

    const nodes: Node3D[] = [];
    const nodeCount = 50;

    // Distribute nodes over a beautiful 3D sphere shell
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const radius = 110;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      nodes.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        color: i % 2 === 0 ? "rgba(99, 102, 241, 0.85)" : "rgba(168, 85, 247, 0.85)",
        size: Math.random() * 2.5 + 1.5,
      });
    }

    let rotX = 0;
    let rotY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Base rotation combined with mouse tilt forces
      rotY += 0.006 + mouseRef.current.x * 0.00003;
      rotX += 0.003 + mouseRef.current.y * 0.00003;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const fov = 300;
      const cx = width / 2;
      const cy = height / 2;

      // Project and map 3D points
      const projected = nodes.map((node) => {
        // Rotate Y
        let x1 = node.baseX * cosY - node.baseZ * sinY;
        let z1 = node.baseX * sinY + node.baseZ * cosY;

        // Rotate X
        let y2 = node.baseY * cosX - z1 * sinX;
        let z2 = node.baseY * sinX + z1 * cosX;

        // Perspective scale
        const scale = fov / (fov + z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;

        return { x: px, y: py, z: z2, node };
      });

      // Sort by depth (z-index) so elements are rendered correctly front-to-back
      projected.sort((a, b) => b.z - a.z);

      // Draw subtle energy connection pathways
      ctx.lineWidth = 0.55;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          // Check direct Euclidean distance in projected spaces
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 75) {
            const alpha = (1 - dist / 75) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw beautiful nodes with radial glowing shadows
      projected.forEach((p) => {
        const opacity = Math.max(0.2, (fov - p.z) / (fov * 1.5));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.node.size * (fov / (fov + p.z)), 0, Math.PI * 2);

        // Gradient coloring
        ctx.fillStyle = p.node.color.replace("0.85", opacity.toString());
        ctx.fill();

        // Node specular highlights
        if (p.z < 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.node.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(34, 211, 238, 0.08)";
          ctx.fill();
        }
      });

      // Draw interactive center Core Ring
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Pulsing outer orbit ring
      const radiusOffset = Math.sin(Date.now() * 0.002) * 8;
      ctx.beginPath();
      ctx.arc(cx, cy, 160 + radiusOffset, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(168, 85, 247, 0.04)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 12]);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [isInitialized]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all credentials.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Successfully authenticated. Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid authentication credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please provide your email address.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(forgotEmail);
      toast.success("Recovery instructions dispatched successfully. Inspect your inbox!");
      setShowForgot(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to process recovery request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex overflow-hidden select-none relative font-sans">
      {/* Noise grain overlay */}
      <div className="noise-overlay" />

      {/* Futuristic Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full filter blur-[150px] animate-pulse duration-[12000ms] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full filter blur-[150px] animate-pulse duration-[15000ms] pointer-events-none" />

      {/* Modern Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-3.5 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-xl text-slate-400 hover:text-white text-xs tracking-wider uppercase font-mono transition-all duration-300 font-semibold group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
      </Link>

      <AnimatePresence mode="wait">
        {!isInitialized ? (
          /* CINEMATIC AI INITIALIZATION SCREEN */
          <motion.div 
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#02040a] z-50 px-6"
          >
            {/* Grid backdrops */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.02)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            <div className="w-full max-w-lg text-center space-y-12 relative">
              {/* Spinning tech logo */}
              <div className="relative mx-auto flex items-center justify-center h-20 w-20 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl p-0.5 shadow-[0_0_40px_rgba(99,102,241,0.25)]">
                <div className="absolute inset-0.5 rounded-[22px] bg-[#02040a] flex items-center justify-center">
                  <GraduationCap className="h-10 w-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 animate-pulse" />
                </div>
                {/* Orbital particles */}
                <div className="absolute -inset-1 rounded-3xl border border-white/10 animate-spin duration-3000 opacity-60" />
              </div>

              {/* Progress Texts */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold font-mono tracking-[0.25em] text-cyan-400 uppercase">
                  SkillBridge Operating System
                </h3>
                <div className="h-4 overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={bootText}
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm font-sans text-slate-300 font-medium"
                    >
                      {bootText}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Premium Progress Bar */}
              <div className="w-full max-w-sm mx-auto space-y-2">
                <div className="h-[2.5px] w-full bg-white/[0.03] rounded-full overflow-hidden relative border border-white/5">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_10px_#6366f1]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${bootProgress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest px-1">
                  <span>SYSTEM BOOT</span>
                  <span>{bootProgress}% Loaded</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* FULL AI GATEWAY PORTAL */
          <motion.div 
            key="portal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full flex"
          >
            {/* Left Column: Interactive 3D presentation & widgets */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden bg-gradient-to-br from-[#040612] via-[#02040a] to-[#040816] border-r border-white/5">
              {/* Digital grid mesh layer */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-70 pointer-events-none" />

              {/* Brand Logo Header */}
              <div className="flex items-center gap-4 relative z-10 group/brand cursor-pointer select-none overflow-visible min-w-max">
                <div className="relative flex items-center justify-center h-12 w-12 bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover/brand:shadow-[0_0_30px_rgba(168,85,247,0.5)] group-hover/brand:scale-[1.04] transition-all duration-500 ease-out flex-shrink-0">
                  <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
                  <GraduationCap className="h-6.5 w-6.5 relative z-10 flex-shrink-0" />
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

              {/* Spectacular 3D Interactive Core Container */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <canvas ref={canvasRef} className="w-[110%] h-[110%] max-w-[650px] max-h-[650px] object-contain opacity-85 pointer-events-auto" />
              </div>

              {/* Central Copy & Bulletpoints */}
              <div className="space-y-6 relative z-10 my-auto text-left max-w-lg">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-indigo-400 font-mono font-bold shadow-md">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                  <span className="uppercase text-[9px] tracking-wider text-slate-300">Gateway Authorized</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-display leading-[1.2]">
                  Unlocking Potential,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 text-glow">
                    Engineered for Placement.
                  </span>
                </h2>
                <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                  Secure access to a comprehensive career suite equipped with neural path mappings, ATS resume vectors, and real-time model mock interview checkups.
                </p>

                {/* Live Active Status Grid */}
                <div className="grid grid-cols-2 gap-3.5 pt-4">
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-mono text-slate-300 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>AI Engine Active</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-mono text-slate-300 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Groq-LLM Connected</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-mono text-slate-300 shadow-sm">
                    <Shield className="h-4 w-4 text-purple-400" />
                    <span>Safe Sandbox SDK</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-mono text-slate-300 shadow-sm">
                    <Cpu className="h-4 w-4 text-indigo-400" />
                    <span>Matrix Match v1.0</span>
                  </div>
                </div>
              </div>

              {/* Footer System Line */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Bridging Academia and Industry</span>
                <span>SYSTEM STATUS: OPERATIONAL</span>
              </div>
            </div>

            {/* Right Column: Portal Auth Card with 3D Tilt Glare */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative bg-gradient-to-tr from-[#02040a] via-[#050813] to-[#02040a]">
              {/* Blur Backlights */}
              <div className="absolute w-[350px] h-[350px] bg-indigo-500/[0.03] rounded-full filter blur-[120px] top-1/4 pointer-events-none" />
              <div className="absolute w-[300px] h-[300px] bg-purple-500/[0.03] rounded-full filter blur-[120px] bottom-1/4 pointer-events-none" />

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-full max-w-md bg-[#030612]/70 border border-white/5 hover:border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 group"
              >
                {/* Tech Laser Sweep line at top border */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-80" />

                <div className="flex flex-col items-center mb-8 text-center relative z-10">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl mb-3.5 group-hover:scale-105 transition-all duration-300">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white font-display">System Authentication</h2>
                  <p className="text-xs text-slate-400 mt-1.5 font-sans leading-relaxed">Decrypt workspace parameters to enter your console environment.</p>
                </div>

                {!showForgot ? (
                  /* Login Form */
                  <form onSubmit={handleLogin} className="space-y-5 relative z-10 text-left">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                        Authorization Key / Email
                      </label>
                      <div className="relative group/input">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors">
                          <Mail className="h-4.5 w-4.5" />
                        </span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#050811]/70 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 shadow-inner"
                          placeholder="name@university.edu"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                          Secure Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowForgot(true)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-colors"
                        >
                          Forgot Keys?
                        </button>
                      </div>
                      <div className="relative group/input">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors">
                          <Lock className="h-4.5 w-4.5" />
                        </span>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[#050811]/70 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 shadow-inner"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    {/* Gradient Interactive Button with Sweep Effect */}
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full mt-6 py-3 relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.35)] active:scale-[0.98] overflow-hidden group/btn cursor-pointer"
                    >
                      {/* Sweep Highlight */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                      
                      {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Sign In to Console <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-slate-500 mt-6 pt-5 border-t border-white/5">
                      New applicant?{" "}
                      <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                        Create AI Profile
                      </Link>
                    </p>
                  </form>
                ) : (
                  /* Forgot Password Form */
                  <form onSubmit={handleForgotPassword} className="space-y-5 relative z-10 text-left">
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Enter your credential email below. We'll dispatch standard recovery links to restore portal access keys.
                    </p>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                        Verification Email
                      </label>
                      <div className="relative group/input">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors">
                          <Mail className="h-4.5 w-4.5" />
                        </span>
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full bg-[#050811]/70 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 shadow-inner"
                          placeholder="name@university.edu"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-6 py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Dispatch Recovery Link"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowForgot(false)}
                      className="w-full text-center text-xs text-slate-400 hover:text-slate-200 mt-4 cursor-pointer transition-colors"
                    >
                      Back to Sign In
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;

