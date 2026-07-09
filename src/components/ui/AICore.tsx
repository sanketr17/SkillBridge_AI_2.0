import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Terminal, Cpu, Database, Network } from "lucide-react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  origX: number;
  origY: number;
  origZ: number;
  speed: number;
  phase: number;
}

export const AICore: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulseTextRef = useRef<HTMLSpanElement>(null);

  // Holographic Core Diagnostics State
  const [synapses, setSynapses] = useState(256);
  const [load, setLoad] = useState(14);

  // Mouse interactivity state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    // Periodically update mock stats to make the AI core look alive
    const interval = setInterval(() => {
      setSynapses((prev) => Math.min(300, Math.max(220, prev + Math.floor(Math.random() * 11) - 5)));
      setLoad((prev) => Math.min(25, Math.max(8, prev + Math.floor(Math.random() * 5) - 2)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Handle Resize
    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container) return;
      const w = Math.floor(container.clientWidth || container.getBoundingClientRect().width || 500);
      const h = Math.floor(container.clientHeight || container.getBoundingClientRect().height || 500);
      
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Generate beautiful 3D Points forming a sphere (normalized coordinates with radius 1)
    const points: Point3D[] = [];
    const numPoints = 140;

    for (let i = 0; i < numPoints; i++) {
      // Golden spiral distribution for a beautifully uniform sphere
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;

      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);

      points.push({
        x,
        y,
        z,
        origX: x,
        origY: y,
        origZ: z,
        speed: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Floating independent nodes (satellites orbiting around the core, with normalized radius multiplier)
    const satellites: { radiusMultiplier: number; angle: number; speed: number; plane: "xy" | "xz" | "yz"; size: number }[] = [];
    for (let i = 0; i < 15; i++) {
      satellites.push({
        radiusMultiplier: 1.1 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
        plane: i % 3 === 0 ? "xy" : i % 3 === 1 ? "xz" : "yz",
        size: 1.5 + Math.random() * 2
      });
    }

    // Camera and Rotational State
    let angleX = 0.002;
    let angleY = 0.003;
    let rx = 0;
    let ry = 0;

    // Pulse effects
    let pulseTime = 0;

    // Render loop
    const render = () => {
      const w = canvas.width || 500;
      const h = canvas.height || 500;
      ctx.clearRect(0, 0, w, h);

      // Determine dynamic sphereRadius based on current width/height
      const sphereRadius = Math.min(w, h) * 0.28;

      if (w <= 0 || h <= 0 || sphereRadius <= 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Smooth mouse rotation interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Cumulative base rotation plus mouse offset influence
      rx += angleX + mouse.y * 0.0001;
      ry += angleY + mouse.x * 0.0001;

      // Update pulse animation
      pulseTime += 0.04;
      const pulseScaleVal = 1 + Math.sin(pulseTime) * 0.06;
      const pulseRadius = (1 + Math.sin(pulseTime) * 0.1) * (sphereRadius * 0.35);
      if (pulseTextRef.current) {
        pulseTextRef.current.textContent = `AI CORE PULSE: ${(pulseScaleVal * 100).toFixed(0)}%`;
      }

      const centerX = w / 2;
      const centerY = h / 2;
      const fov = Math.max(w, h) * 1.5; // perspective field of view

      // 1. Draw glowing background radial light
      const bgGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, Math.max(10, sphereRadius * 1.5));
      bgGlow.addColorStop(0, "rgba(99, 102, 241, 0.04)");
      bgGlow.addColorStop(0.5, "rgba(168, 85, 247, 0.02)");
      bgGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw pulsating energy rings (soundwaves/gravity fields)
      for (let ringIdx = 0; ringIdx < 3; ringIdx++) {
        const ringProgress = ((pulseTime * 0.15 + ringIdx * 0.33) % 1);
        const currentRingRadius = sphereRadius * 1.4 * ringProgress;
        const ringOpacity = (1 - ringProgress) * 0.18;

        ctx.strokeStyle = `rgba(129, 140, 248, ${ringOpacity})`;
        ctx.lineWidth = 1.2;
        ctx.shadowColor = "rgba(99, 102, 241, 0.3)";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        // project the flat ring slightly in isometric projection
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(1.0, 0.4);
        ctx.arc(0, 0, currentRingRadius, 0, Math.PI * 2);
        ctx.restore();
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      // 3. Draw deep glowing center "Quantum Energy Core"
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, Math.max(5, pulseRadius));
      coreGradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      coreGradient.addColorStop(0.2, "rgba(99, 102, 241, 0.8)");
      coreGradient.addColorStop(0.5, "rgba(168, 85, 247, 0.35)");
      coreGradient.addColorStop(1, "rgba(6, 182, 212, 0)");
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Additional bright center sparkle
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Project and compute 3D points
      const projectedPoints: { x: number; y: number; z: number; size: number; opacity: number }[] = [];

      points.forEach((pt) => {
        // Add dynamic micro floating movement along normal
        const phaseShift = Math.sin(pulseTime * pt.speed + pt.phase) * 6;
        const r = sphereRadius + phaseShift;
        const tempX = pt.origX * r;
        const tempY = pt.origY * r;
        const tempZ = pt.origZ * r;

        // Apply 3D Rotations
        // Rotate Y
        let x1 = tempX * Math.cos(ry) - tempZ * Math.sin(ry);
        let z1 = tempX * Math.sin(ry) + tempZ * Math.cos(ry);

        // Rotate X
        let y2 = tempY * Math.cos(rx) - z1 * Math.sin(rx);
        let z2 = tempY * Math.sin(rx) + z1 * Math.cos(rx);

        // Position camera depth
        const cameraZ = sphereRadius * 3;
        const depth = z2 + cameraZ;

        // Perspective Projection
        const scale = fov / (fov + z2);
        const screenX = centerX + x1 * scale;
        const screenY = centerY + y2 * scale;

        // Visual attributes based on depth z-buffer
        const depthPercent = (z2 + sphereRadius) / (2 * sphereRadius); // 0 (front) to 1 (back)
        const opacity = Math.max(0.08, Math.min(0.9, 1.0 - depthPercent));
        const pointSize = Math.max(1, (1.8 - depthPercent) * 2.5);

        projectedPoints.push({
          x: screenX,
          y: screenY,
          z: z2,
          size: pointSize,
          opacity
        });
      });

      // 4. Draw neural network links (lines connecting points)
      ctx.lineWidth = 0.55;
      const maxDistance = sphereRadius * 0.42;

      for (let i = 0; i < projectedPoints.length; i++) {
        const p1 = projectedPoints[i];
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p2 = projectedPoints[j];

          // We check the standard 3D distance by matching positions
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * 0.14 * Math.min(p1.opacity, p2.opacity);
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 5. Draw glowing neural nodes (particles)
      projectedPoints.forEach((p) => {
        ctx.fillStyle = `rgba(129, 140, 248, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Highlight front-most nodes with a tiny bright core and glow
        if (p.z < -sphereRadius * 0.4) {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 1.2})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 6. Draw outer orbiting satellites with delicate light trails
      satellites.forEach((sat) => {
        sat.angle += sat.speed;
        let x = 0;
        let y = 0;
        let z = 0;
        const satRadius = sphereRadius * sat.radiusMultiplier;

        if (sat.plane === "xy") {
          x = Math.cos(sat.angle) * satRadius;
          y = Math.sin(sat.angle) * satRadius * 0.5;
        } else if (sat.plane === "xz") {
          x = Math.cos(sat.angle) * satRadius;
          z = Math.sin(sat.angle) * satRadius;
        } else {
          y = Math.cos(sat.angle) * satRadius;
          z = Math.sin(sat.angle) * satRadius * 0.6;
        }

        // Apply same global rotations to satellites
        let x1 = x * Math.cos(ry) - z * Math.sin(ry);
        let z1 = x * Math.sin(ry) + z * Math.cos(ry);
        let y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
        let z2 = y * Math.sin(rx) + z1 * Math.cos(rx);

        const scale = fov / (fov + z2);
        const screenX = centerX + x1 * scale;
        const screenY = centerY + y2 * scale;

        const depthPercent = (z2 + sphereRadius * 1.5) / (3 * sphereRadius);
        const opacity = Math.max(0.1, Math.min(0.9, 1.0 - depthPercent));

        // Draw orbital particle
        ctx.fillStyle = sat.plane === "xy" ? "#06b6d4" : sat.plane === "xz" ? "#a855f7" : "#6366f1";
        ctx.shadowColor = ctx.fillStyle as string;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(screenX, screenY, sat.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Tiny connection line back to energy core
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.08})`;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(screenX, screenY);
        ctx.stroke();
      });

      // 7. Draw subtle scan lines & holographic scope markings
      ctx.strokeStyle = "rgba(99, 102, 241, 0.03)";
      ctx.lineWidth = 1;
      for (let gridLine = 20; gridLine < w; gridLine += 40) {
        ctx.beginPath();
        ctx.moveTo(gridLine, 0);
        ctx.lineTo(gridLine, h);
        ctx.stroke();
      }

      // Compass circular markings on side
      ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.25, 0, Math.PI * 2);
      ctx.stroke();

      // Outer ticks
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.15)";
      for (let tick = 0; tick < 8; tick++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(sphereRadius * 1.22, 0);
        ctx.lineTo(sphereRadius * 1.28, 0);
        ctx.stroke();
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[380px] md:h-[500px] flex items-center justify-center select-none overflow-hidden rounded-3xl border border-white/5 bg-[#030612]/30 backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),_inset_0_1px_1px_rgba(255,255,255,0.03)] group"
    >
      {/* Decorative Aurora background behind the canvas */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-purple-500/5 to-cyan-500/5 opacity-50 blur-xl pointer-events-none" />

      {/* Grid crosshairs in the corners of holographic terminal */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-indigo-400/50 flex flex-col gap-1 pointer-events-none">
        <span>SYS.LOC: MAIN_CORE_01</span>
        <span>STATUS: STEADY</span>
      </div>
      <div className="absolute top-4 right-4 font-mono text-[9px] text-cyan-400/50 flex flex-col items-end gap-1 pointer-events-none">
        <span>GRID.ALIGN: ACTIVE</span>
        <span>LATENCY: 12ms</span>
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[9px] text-slate-500 flex items-center gap-1.5 pointer-events-none">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>INTELLIGENT RECOGNITION ACTIVE</span>
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[9px] text-purple-400/50 pointer-events-none">
        <span>FBO_DEPTH_BUFFER: 60FPS</span>
      </div>

      {/* Core Canvas element */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 block pointer-events-none" />

      {/* Live HUD Floating Overlays (Top Center status indicator) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </div>
        <span ref={pulseTextRef} className="text-[10px] text-slate-300 font-mono tracking-wider uppercase font-semibold">
          AI CORE PULSE: 100%
        </span>
      </div>

      {/* HUD metrics dashboard stats attached dynamically */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-4 w-full px-6 justify-center max-w-sm pointer-events-none">
        <div className="px-3.5 py-2.5 rounded-2xl bg-slate-950/75 border border-white/5 flex-1 flex flex-col items-center">
          <Cpu className="h-4 w-4 text-indigo-400 mb-1" />
          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Synaptic Weight</span>
          <span className="text-sm font-bold text-white font-mono mt-0.5">{synapses}M</span>
        </div>

        <div className="px-3.5 py-2.5 rounded-2xl bg-slate-950/75 border border-white/5 flex-1 flex flex-col items-center">
          <Network className="h-4 w-4 text-purple-400 mb-1" />
          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Active Links</span>
          <span className="text-sm font-bold text-white font-mono mt-0.5">{(synapses * 4).toLocaleString()}</span>
        </div>

        <div className="px-3.5 py-2.5 rounded-2xl bg-slate-950/75 border border-white/5 flex-1 flex flex-col items-center">
          <Database className="h-4 w-4 text-cyan-400 mb-1" />
          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">CPU Engine</span>
          <span className="text-sm font-bold text-white font-mono mt-0.5">{load}%</span>
        </div>
      </div>
    </div>
  );
};
