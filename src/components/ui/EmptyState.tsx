import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-700 rounded-2xl bg-[#1E293B]/20 backdrop-blur-sm">
      <div className="p-3 bg-[#0F172A] rounded-xl border border-slate-700 text-slate-500 mb-4 shadow-inner">
        {icon || <FolderOpen className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-medium text-slate-200 tracking-tight mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
