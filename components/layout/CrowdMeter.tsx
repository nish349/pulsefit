'use client';

import React from 'react';
import { useGymStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

export default function CrowdMeter() {
  const { occupancy } = useGymStore();

  let status = 'Quiet';
  let color = 'bg-emerald-500';
  let textColor = 'text-emerald-500';
  let pulse = false;

  if (occupancy > 40 && occupancy <= 75) {
    status = 'Moderate';
    color = 'bg-amber-500';
    textColor = 'text-amber-500';
  } else if (occupancy > 75) {
    status = 'Busy';
    color = 'bg-red-500';
    textColor = 'text-red-500';
    pulse = true;
  }

  return (
    <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
      <div className="relative flex items-center justify-center w-3 h-3">
        {pulse && (
           <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping", color)}></span>
        )}
        <span className={cn("relative inline-flex rounded-full h-2 w-2", color)}></span>
      </div>
      <div className="flex flex-col leading-none">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Live Crowd</span>
          <span className={cn("text-xs font-bold", textColor)}>{status}</span>
      </div>
    </div>
  );
}
