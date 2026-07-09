import React from "react";

export const LoadingSpinner: React.FC<{ size?: "sm" | "md" | "lg"; fullPage?: boolean }> = ({
  size = "md",
  fullPage = false
}) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4"
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-t-indigo-500 border-r-transparent border-slate-800 ${sizeClasses[size]}`}
      />
      {size === "lg" && (
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest animate-pulse">
          Realigning systems...
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>;
};

export default LoadingSpinner;
