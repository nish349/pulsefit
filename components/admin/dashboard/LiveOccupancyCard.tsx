import React from 'react';
import { Users2 } from 'lucide-react';

export default function LiveOccupancyCard() {
  const currentCount = 84;
  const capacity = 200;

  return (
    <div className="bg-[#161b27] border border-[#1e2a3a] rounded-2xl p-5 flex flex-col h-[240px]">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="font-bold text-slate-400 flex items-center gap-2 text-sm uppercase tracking-wider">
          Live Occupancy
        </h3>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Low Traffic
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center my-2">
        <div className="flex items-baseline gap-1">
          <span className="text-6xl font-black text-white">{currentCount}</span>
          <span className="text-2xl font-bold text-slate-600">/{capacity}</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-[#1e2a3a] text-center">
        <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all w-full">View Attendance</button>
      </div>
    </div>
  );
}
