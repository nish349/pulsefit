import React, { ElementType } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-slate-800 bg-slate-900/40",
        compact ? "py-8 px-4" : "py-16 px-6",
        className
      )}
    >
      <div className={cn(
        "rounded-full bg-slate-800/50 flex items-center justify-center mb-4 text-slate-500",
        compact ? "w-12 h-12" : "w-16 h-16"
      )}>
        <Icon size={compact ? 24 : 32} strokeWidth={1.5} />
      </div>
      <h3 className={cn("text-white font-medium mb-1", !compact && "text-lg")}>{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
