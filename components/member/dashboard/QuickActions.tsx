"use client";

import { CalendarPlus, Dumbbell } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
          <CalendarPlus size={24} />
        </div>
        <span className="font-semibold text-sm">Book Class</span>
      </button>

      <button className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group">
        <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Dumbbell size={24} />
        </div>
        <span className="font-semibold text-sm">View Workout</span>
      </button>
    </div>
  );
}
