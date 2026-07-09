import React, { useEffect, useRef } from "react";

export const Ambient3DBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse coordinates with easing
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = e.clientX;
      mouseRef.current.ty = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Define 3D-projected shapes
    interface Point3D {
      x: number;
      y: number;
      z: number;
    }

    interface Shape3D {
      type: "cube" | "prism" | "ring" | "star";
      center: Point3D;
      size: number;
      rotX: number;
      rotY: number;
      rotZ: number;
      speedX: number;
      speedY: number;
      speedZ: number;
      color: string;
      vertices: Point3D[];
      edges: [number, number][];
    }

    const shapes: Shape3D[] = [];

    // Create a 3D wireframe Cube
    const createCube = (center: Point3D, size: number, color: string): Shape3D => {
      const vertices: Point3D[] = [
        { x: -1, y: -1, z: -1 },
        { x: 1, y: -1, z: -1 },
        { x: 1, y: 1, z: -1 },
        { x: -1, y: 1, z: -1 },
        { x: -1, y: -1, z: 1 },
        { x: 1, y: -1, z: 1 },
        { x: 1, y: 1, z: 1 },
        { x: -1, y: 1, z: 1 },
      ].map((p) => ({ x: p.x * size, y: p.y * size, z: p.z * size }));

      const edges: [number, number][] = [
        [0, 1], [1, 2], [2, 3], [3, 0], // Back face
        [4, 5], [5, 6], [6, 7], [7, 4], // Front face
        [0, 4], [1, 5], [2, 6], [3, 7], // Pillars
      ];

      return {
        type: "cube",
        center,
        size,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        speedX: (Math.random() - 0.5) * 0.005,
        speedY: (Math.random() - 0.5) * 0.005,
        speedZ: (Math.random() - 0.5) * 0.005,
        color,
        vertices,
        edges,
      };
    };

    // Create a 3D wireframe Prism (Pyramid)
    const createPrism = (center: Point3D, size: number, color: string): Shape3D => {
      const vertices: Point3D[] = [
        { x: 0, y: -1.2, z: 0 }, // Apex
        { x: -1, y: 0.8, z: -1 }, // Base 1
        { x: 1, y: 0.8, z: -1 }, // Base 2
        { x: 1, y: 0.8, z: 1 },  // Base 3
        { x: -1, y: 0.8, z: 1 }, // Base 4
      ].map((p) => ({ x: p.x * size, y: p.y * size, z: p.z * size }));

      const edges: [number, number][] = [
        [1, 2], [2, 3], [3, 4], [4, 1], // Base
        [0, 1], [0, 2], [0, 3], [0, 4], // Sides
      ];

      return {
        type: "prism",
        center,
        size,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        speedX: (Math.random() - 0.5) * 0.004,
        speedY: (Math.random() - 0.5) * 0.004,
        speedZ: (Math.random() - 0.5) * 0.004,
        color,
        vertices,
        edges,
      };
    };

    // Generate floating shapes
    shapes.push(createCube({ x: width * 0.15, y: height * 0.25, z: 100 }, 45, "99, 102, 241"));
    shapes.push(createPrism({ x: width * 0.85, y: height * 0.3, z: 50 }, 50, "168, 85, 247"));
    shapes.push(createCube({ x: width * 0.75, y: height * 0.8, z: 150 }, 35, "34, 211, 238"));
    shapes.push(createPrism({ x: width * 0.2, y: height * 0.75, z: 80 }, 40, "99, 102, 241"));

    // Micro ambient floating neural particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }

    const particles: Particle[] = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    // Projection constants
    const fov = 350;

    const rotatePoint = (p: Point3D, rx: number, ry: number, rz: number): Point3D => {
      let x = p.x;
      let y = p.y;
      let z = p.z;

      // Rotate X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;

      // Rotate Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x2 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;

      // Rotate Z
      const cosZ = Math.cos(rz);
      const sinZ = Math.sin(rz);
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;

      return { x: x3, y: y3, z: z2 };
    };

    const project = (p: Point3D, cx: number, cy: number, cz: number, mouseOffset: { x: number; y: number }) => {
      // Perspective scale factor
      const scale = fov / (fov + p.z + cz);
      return {
        x: cx + p.x * scale + mouseOffset.x * (50 / (p.z + cz + 50)),
        y: cy + p.y * scale + mouseOffset.y * (50 / (p.z + cz + 50)),
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing
      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.05;
      m.y += (m.ty - m.y) * 0.05;

      const mouseOffset = {
        x: (m.x - width / 2) * 0.08,
        y: (m.y - height / 2) * 0.08,
      };

      // Draw subtle background neural particles
      ctx.fillStyle = "rgba(148, 163, 184, 0.15)";
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap-around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse influence
        const dx = m.x - p.x;
        const dy = m.y - p.y;
        const dist = Math.hypot(dx, dy);
        const maxDist = 120;
        let ox = 0, oy = 0;
        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          ox = (dx / dist) * force * -15;
          oy = (dy / dist) * force * -15;
        }

        ctx.beginPath();
        ctx.arc(p.x + ox, p.y + oy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${p.alpha})`;
        ctx.fill();
      });

      // Draw beautiful interconnected neural web for nodes close together
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${(100 - dist) * 0.0006})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw 3D projected shapes
      shapes.forEach((shape) => {
        // Drift shape center slightly over time
        shape.center.y += Math.sin(Date.now() * 0.0005 + shape.center.x) * 0.08;

        shape.rotX += shape.speedX;
        shape.rotY += shape.speedY;
        shape.rotZ += shape.speedZ;

        const rotatedVertices = shape.vertices.map((v) =>
          rotatePoint(v, shape.rotX, shape.rotY, shape.rotZ)
        );

        const projectedVertices = rotatedVertices.map((v) =>
          project(v, shape.center.x, shape.center.y, shape.center.z, mouseOffset)
        );

        // Draw translucent faces/shading to simulate 3D volume
        if (shape.type === "prism") {
          // Bottom base fill
          ctx.beginPath();
          ctx.moveTo(projectedVertices[1].x, projectedVertices[1].y);
          ctx.lineTo(projectedVertices[2].x, projectedVertices[2].y);
          ctx.lineTo(projectedVertices[3].x, projectedVertices[3].y);
          ctx.lineTo(projectedVertices[4].x, projectedVertices[4].y);
          ctx.closePath();
          ctx.fillStyle = `rgba(${shape.color}, 0.025)`;
          ctx.fill();
        }

        // Draw edges with crisp, glowy strokes
        ctx.beginPath();
        shape.edges.forEach(([u, v]) => {
          const p1 = projectedVertices[u];
          const p2 = projectedVertices[v];
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        });
        ctx.strokeStyle = `rgba(${shape.color}, 0.25)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw glowing vertices
        projectedVertices.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${shape.color}, 0.65)`;
          ctx.fill();
        });
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.85 }}
    />
  );
};

export default Ambient3DBackground;
