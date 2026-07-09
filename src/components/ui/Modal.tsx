import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md"
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className={`relative w-full ${sizes[size]} bg-slate-950/75 border border-white/10 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.06)] backdrop-blur-3xl overflow-hidden z-10 flex flex-col max-h-[90vh]`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-lg font-bold text-white tracking-tight font-display">{title}</h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-all p-1.5 hover:bg-white/5 rounded-lg cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 text-slate-300">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
