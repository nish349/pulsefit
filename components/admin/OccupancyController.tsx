'use client';

import React from 'react';
import { useGymStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Users, AlertCircle, Info } from 'lucide-react';

export default function OccupancyController() {
  const { occupancy, setOccupancy } = useGymStore();

  let status = 'Low';
  let color = 'bg-emerald-500';
  
  if (occupancy > 40 && occupancy <= 75) {
     status = 'Medium';
     color = 'bg-amber-500';
  } else if (occupancy > 75) {
     status = 'High';
     color = 'bg-red-500';
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group relative overflow-hidden">
        {/* Decorative Background */}
       <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10", color)} />

       <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
             <Users size={20} />
          </div>
          <div className={cn("flex items-center text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider", 
             occupancy > 75 ? "bg-red-500/10 text-red-500" :
             occupancy > 40 ? "bg-amber-500/10 text-amber-500" :
             "bg-emerald-500/10 text-emerald-500"
          )}>
             {status} Traffic
          </div>
       </div>

       <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 relative z-10">Live Occupancy</h3>
       <div className="text-3xl font-bold text-white mb-4 relative z-10 flex items-baseline gap-2">
          {occupancy}%
          <span className="text-sm font-medium text-slate-500">Capacity</span>
       </div>

       {/* Slider Control */}
       <div className="space-y-3 relative z-10">
          <div className="flex justify-between text-xs text-slate-500 font-mono">
             <span>0%</span>
             <span>50%</span>
             <span>100%</span>
          </div>
          <input 
             type="range" 
             min="0" 
             max="100" 
             value={occupancy}
             onChange={(e) => setOccupancy(parseInt(e.target.value))}
             className={cn("w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-emerald-500",
                occupancy > 75 ? "accent-red-500" : occupancy > 40 ? "accent-amber-500" : "accent-emerald-500"
             )}
          />
          <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-950/50 p-2 rounded-lg border border-slate-800">
             <Info size={12} className="text-slate-400" />
             Dragging this updates public site instantly.
          </div>
       </div>
    </div>
  );
}
