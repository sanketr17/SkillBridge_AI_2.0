import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export const PremiumCursor: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [hoverType, setHoverType] = useState<string | null>(null);

  // Position of cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const ringSpringConfig = { damping: 30, stiffness: 220, mass: 0.8 };
  const ringXSpring = useSpring(cursorX, ringSpringConfig);
  const ringYSpring = useSpring(cursorY, ringSpringConfig);

  useEffect(() => {
    // Only enable cursor on devices with fine pointer (not touch screens)
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    setMounted(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable =
        target.closest("button") ||
        target.closest("a") ||
        target.closest('[role="button"]') ||
        target.closest(".group\\/card") ||
        target.closest("input") ||
        target.closest("select") ||
        target.closest("textarea");

      if (isClickable) {
        setHoverType("clickable");
      } else {
        setHoverType(null);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <>
      {/* Outer Glowing Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-indigo-500/40 pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: ringXSpring,
          y: ringYSpring,
          translateX: "-50%",
          translateY: "-50%",
          scale: hoverType === "clickable" ? 1.6 : 1,
          borderColor: hoverType === "clickable" ? "rgba(168, 85, 247, 0.6)" : "rgba(99, 102, 241, 0.4)",
          backgroundColor: hoverType === "clickable" ? "rgba(168, 85, 247, 0.05)" : "rgba(99, 102, 241, 0)",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      />

      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cyan-400 pointer-events-none z-[9999] shadow-[0_0_8px_#22d3ee]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          scale: hoverType === "clickable" ? 0.5 : 1,
        }}
      />
    </>
  );
};

export default PremiumCursor;
