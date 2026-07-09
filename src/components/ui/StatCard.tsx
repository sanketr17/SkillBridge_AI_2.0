import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Interactive3DCard from "./Interactive3DCard";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  accentColor?: string; // e.g. "indigo", "purple", "cyan", "emerald"
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  accentColor = "indigo"
}) => {
  const accentBorderColors = {
    indigo: "border-t-indigo-500",
    purple: "border-t-purple-500",
    cyan: "border-t-cyan-500",
    emerald: "border-t-emerald-500"
  };

  const accentTextColors = {
    indigo: "text-indigo-400",
    purple: "text-purple-400",
    cyan: "text-cyan-400",
    emerald: "text-emerald-400"
  };

  const accentBgColors = {
    indigo: "bg-indigo-500/5",
    purple: "bg-purple-500/5",
    cyan: "bg-cyan-500/5",
    emerald: "bg-emerald-500/5"
  };

  return (
    <Interactive3DCard className="p-6 min-h-[140px] flex flex-col justify-between">
      {/* Background radial highlight */}
      <div className={`absolute -right-6 -top-6 w-28 h-28 rounded-full filter blur-2xl opacity-20 group-hover:opacity-35 transition-opacity duration-300 ${accentBgColors[accentColor as keyof typeof accentBgColors] || "bg-indigo-500/10"}`} />

      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase font-mono">{title}</span>
        {icon && (
          <div className={`p-2 rounded-xl border border-white/5 bg-white/5 group-hover:scale-110 group-hover:border-indigo-500/30 transition-all duration-300 ${accentTextColors[accentColor as keyof typeof accentTextColors] || "text-indigo-400"}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mt-auto">
        <span className="text-3xl font-bold text-white tracking-tight font-display">{value}</span>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ${trend.isPositive ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-red-400 bg-red-500/10 border border-red-500/20"}`}>
            {trend.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend.value}%
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-slate-400 mt-3 font-sans border-t border-white/5 pt-2 group-hover:text-slate-300 transition-colors duration-200">{description}</p>
      )}
    </Interactive3DCard>
  );
};

export default StatCard;
