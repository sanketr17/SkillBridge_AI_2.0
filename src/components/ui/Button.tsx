import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed tracking-tight font-sans active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.35)] btn-premium border border-indigo-400/20",
    secondary: "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-[0_4px_20px_rgba(168,85,247,0.25)] hover:shadow-[0_4px_25px_rgba(168,85,247,0.35)] btn-premium border border-purple-400/20",
    accent: "bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 shadow-[0_4px_20px_rgba(6,182,212,0.25)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.35)] font-semibold",
    outline: "border border-white/10 hover:border-white/20 text-slate-200 bg-white/5 hover:bg-white/10 backdrop-blur-md",
    danger: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-[0_4px_20px_rgba(239,68,68,0.2)] hover:shadow-[0_4px_25px_rgba(239,68,68,0.3)]",
    ghost: "text-slate-400 hover:text-slate-100 hover:bg-white/5"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
