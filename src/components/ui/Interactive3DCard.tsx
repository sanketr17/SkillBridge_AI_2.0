import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({
  children,
  className = "",
  onClick,
  id
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Framer motion values for 3D rotation
  const rotateX = useSpring(0, { damping: 25, stiffness: 150 });
  const rotateY = useSpring(0, { damping: 25, stiffness: 150 });

  // Light reflection/shimmer coordinates
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(0, { damping: 20, stiffness: 120 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Map coordinates to percentage (0 - 100)
    const pctX = (mouseX / width) * 100;
    const pctY = (mouseY / height) * 100;

    glareX.set(pctX);
    glareY.set(pctY);

    // Calculate rotation (-10 to 10 degrees)
    const rotX = ((mouseY - height / 2) / (height / 2)) * -8;
    const rotY = ((mouseX - width / 2) / (width / 2)) * 8;

    rotateX.set(rotX);
    rotateY.set(rotY);
  };

  const handleMouseEnter = () => {
    setHovered(true);
    glareOpacity.set(0.15);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  };

  const backgroundGlow = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle 180px at ${x}% ${y}%, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.03) 50%, transparent 100%)`
  );

  const reflectionOverlay = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle 150px at ${x}% ${y}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.03) 40%, transparent 80%)`
  );

  return (
    <div
      ref={cardRef}
      id={id}
      className="relative overflow-visible group/card"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative rounded-2xl border border-white/5 bg-[#030712]/75 backdrop-blur-xl overflow-hidden transition-colors duration-300 group-hover/card:border-white/10 ${className}`}
      >
        {/* Dynamic Light Specular Reflection Layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay transition-opacity duration-300"
          style={{
            background: reflectionOverlay,
            opacity: glareOpacity,
          }}
        />

        {/* Dynamic Ambient Color Backlight Reflection Layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: backgroundGlow,
          }}
        />

        {/* Outer Premium Border Highlight Sweep */}
        <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

        {/* Inner Card Content */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Interactive3DCard;
