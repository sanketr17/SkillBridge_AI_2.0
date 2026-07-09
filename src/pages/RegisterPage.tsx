import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, User, Target, ArrowRight, ArrowLeft, Sparkles, Shield, Cpu, Target as TargetIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { Button } from "../components/ui/Button";
import { emailService } from "../api/email";
import { motion, AnimatePresence } from "motion/react";

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Full-Stack Software Engineer");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Futuristic boot-up sequence states
  const [isInitialized, setIsInitialized] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootText, setBootText] = useState("Accessing Career OS Core...");

  // Canvas ref for the 3D Holographic Core
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const bootSteps = [
      { progress: 20, text: "Allocating Career OS Sandboxed Volume..." },
      { progress: 45, text: "Mapping Skill Matrix Vector Graph..." },
      { progress: 70, text: "Configuring Deep ATS Optimization Engine..." },
      { progress: 90, text: "Securing Token Keys via Firebase Auth..." },
      { progress: 100, text: "Career Profile Core Initialization Complete." }
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
    }, 320);

    return () => clearInterval(interval);
  }, []);

  // Real-time 3D Core Canvas Graphics
  useEffect(() => {
    if (!isInitialized) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

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
    const nodeCount = 55;

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const radius = 115;
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
        color: i % 2 === 0 ? "rgba(168, 85, 247, 0.85)" : "rgba(99, 102, 241, 0.85)",
        size: Math.random() * 2.5 + 1.5,
      });
    }

    let rotX = 0;
    let rotY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      rotY += 0.005 + mouseRef.current.x * 0.00003;
      rotX += 0.003 + mouseRef.current.y * 0.00003;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const fov = 300;
      const cx = width / 2;
      const cy = height / 2;

      const projected = nodes.map((node) => {
        let x1 = node.baseX * cosY - node.baseZ * sinY;
        let z1 = node.baseX * sinY + node.baseZ * cosY;

        let y2 = node.baseY * cosX - z1 * sinX;
        let z2 = node.baseY * sinX + z1 * cosX;

        const scale = fov / (fov + z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;

        return { x: px, y: py, z: z2, node };
      });

      projected.sort((a, b) => b.z - a.z);

      ctx.lineWidth = 0.55;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 80) {
            const alpha = (1 - dist / 80) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      projected.forEach((p) => {
        const opacity = Math.max(0.2, (fov - p.z) / (fov * 1.5));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.node.size * (fov / (fov + p.z)), 0, Math.PI * 2);
        ctx.fillStyle = p.node.color.replace("0.85", opacity.toString());
        ctx.fill();
      });

      ctx.beginPath();
      ctx.arc(cx, cy, 145, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(168, 85, 247, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const rOffset = Math.sin(Date.now() * 0.002) * 6;
      ctx.beginPath();
      ctx.arc(cx, cy, 165 + rOffset, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.05)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 10]);
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [isInitialized]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please provide all required entries.");
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, name);
      toast.success("Profile created successfully! Initializing console.");
      
      // Fire a welcome email as specified in the Resend guidelines
      emailService.sendWelcomeEmail(email, name).then();

      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to create registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex overflow-hidden select-none relative font-sans">
      <div className="noise-overlay" />

      {/* Modern Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-purple-600/10 rounded-full filter blur-[150px] animate-pulse duration-[14000ms] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full filter blur-[150px] animate-pulse duration-[12000ms] pointer-events-none" />

      {/* Back button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-3.5 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-xl text-slate-400 hover:text-white text-xs tracking-wider uppercase font-mono transition-all duration-300 font-semibold group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
      </Link>

      <AnimatePresence mode="wait">
        {!isInitialized ? (
          /* CINEMATIC BOOT SCREEN */
          <motion.div 
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#02040a] z-50 px-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.02)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            <div className="w-full max-w-lg text-center space-y-12 relative">
              <div className="relative mx-auto flex items-center justify-center h-20 w-20 bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-500 rounded-3xl p-0.5 shadow-[0_0_40px_rgba(168,85,247,0.25)]">
                <div className="absolute inset-0.5 rounded-[22px] bg-[#02040a] flex items-center justify-center">
                  <GraduationCap className="h-10 w-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-pulse" />
                </div>
                <div className="absolute -inset-1 rounded-3xl border border-white/10 animate-spin duration-3000 opacity-60" />
              </div>

              <div className="space-y-3.5">
                <h3 className="text-xs font-bold font-mono tracking-[0.25em] text-purple-400 uppercase">
                  Career OS Core Environment
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

              <div className="w-full max-w-sm mx-auto space-y-2">
                <div className="h-[2.5px] w-full bg-white/[0.03] rounded-full overflow-hidden relative border border-white/5">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 shadow-[0_0_10px_#a855f7]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${bootProgress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest px-1">
                  <span>PROFILER INITIALIZATION</span>
                  <span>{bootProgress}% Ready</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* REGISTRATION EXPERIENCE SCREEN */
          <motion.div 
            key="portal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full flex"
          >
            {/* Left Column: Interactive 3D Presentation */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden bg-gradient-to-br from-[#050412] via-[#02040a] to-[#080416] border-r border-white/5">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-70 pointer-events-none" />

              <div className="flex items-center gap-4 relative z-10 group/brand cursor-pointer select-none overflow-visible min-w-max">
                <div className="relative flex items-center justify-center h-12 w-12 bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-500 rounded-2xl text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover/brand:shadow-[0_0_30px_rgba(99,102,241,0.5)] group-hover/brand:scale-[1.04] transition-all duration-500 ease-out flex-shrink-0">
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

              {/* Spectacular Interactive 3D Sphere */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <canvas ref={canvasRef} className="w-[110%] h-[110%] max-w-[650px] max-h-[650px] object-contain opacity-85 pointer-events-auto" />
              </div>

              <div className="space-y-6 relative z-10 my-auto text-left max-w-lg">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-purple-400 font-mono font-bold shadow-md">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
                  <span className="uppercase text-[9px] tracking-wider text-slate-300">Workspace Generator</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-display leading-[1.2]">
                  Start Your Journey,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 text-glow">
                    Pass Every Screen.
                  </span>
                </h2>
                <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                  Join a high-caliber system where academic capability integrates with industry standards using machine learning ATS checks and automated mocks.
                </p>

                {/* Status badges */}
                <div className="grid grid-cols-2 gap-3.5 pt-4">
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-mono text-slate-300 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
                    <span>AI Profiler Online</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-mono text-slate-300 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Resume Scoring Ready</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-mono text-slate-300 shadow-sm">
                    <Shield className="h-4 w-4 text-indigo-400" />
                    <span>Secure Privacy Guard</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-mono text-slate-300 shadow-sm">
                    <Cpu className="h-4 w-4 text-purple-400" />
                    <span>Career Matrix v1.0</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Bridging Academia and Industry</span>
                <span>SYSTEM STATUS: OPERATIONAL</span>
              </div>
            </div>

            {/* Right Column: Premium Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative bg-gradient-to-tr from-[#02040a] via-[#0b0515] to-[#02040a]">
              <div className="absolute w-[350px] h-[350px] bg-purple-500/[0.03] rounded-full filter blur-[120px] top-1/4 pointer-events-none" />
              <div className="absolute w-[300px] h-[300px] bg-indigo-500/[0.03] rounded-full filter blur-[120px] bottom-1/4 pointer-events-none" />

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-full max-w-md bg-[#050312]/70 border border-white/5 hover:border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 group"
              >
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-80" />

                <div className="flex flex-col items-center mb-6 text-center relative z-10">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl mb-3.5 group-hover:scale-105 transition-all duration-300">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white font-display">Initialize AI Profile</h2>
                  <p className="text-xs text-slate-400 mt-1.5 font-sans leading-relaxed">Launch your secure Career OS environment to map target roles.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4.5 relative z-10 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                      Full Legal Name
                    </label>
                    <div className="relative group/input">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within/input:text-purple-400 transition-colors">
                        <User className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#050811]/70 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 shadow-inner"
                        placeholder="Sanket R"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                      Academic Email Key
                    </label>
                    <div className="relative group/input">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within/input:text-purple-400 transition-colors">
                        <Mail className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#050811]/70 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 shadow-inner"
                        placeholder="sanketr980@gmail.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                      Target Placement Track
                    </label>
                    <div className="relative group/input">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within/input:text-purple-400 transition-colors pointer-events-none">
                        <TargetIcon className="h-4.5 w-4.5" />
                      </span>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-[#050811]/70 border border-white/5 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-100 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 shadow-inner appearance-none cursor-pointer"
                      >
                        <option value="Full-Stack Software Engineer">Full-Stack Software Engineer</option>
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend DevOps Architect">Backend DevOps Architect</option>
                        <option value="Cyber Security Analyst">Cyber Security Analyst</option>
                        <option value="AI / ML Engineer">AI / ML Engineer</option>
                      </select>
                      {/* Custom dropdown indicator chevron */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                      Access Password
                    </label>
                    <div className="relative group/input">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within/input:text-purple-400 transition-colors">
                        <Lock className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#050811]/70 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 shadow-inner"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 py-3 relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(168,85,247,0.25)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.35)] active:scale-[0.98] overflow-hidden group/btn cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />

                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Initialize Career OS <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500 mt-6 pt-5 border-t border-white/5">
                    Registered applicant?{" "}
                    <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                      Decrypt Access Keys
                    </Link>
                  </p>
                </form>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegisterPage;
