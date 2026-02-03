"use client";

import { Trophy, TrendingUp } from "lucide-react";

export default function PRCard() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 p-1 rounded-2xl relative overflow-hidden group">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-transparent opacity-50" />
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-neon/20 blur-[60px] rounded-full" />

      <div className="bg-slate-950/50 backdrop-blur-sm rounded-xl p-5 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neon/10 text-neon flex items-center justify-center border border-neon/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Trophy size={24} className="fill-neon/20" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">New Milestone!</h3>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Bench Press</p>
            </div>
          </div>
          <div className="bg-neon/10 text-neon text-xs font-bold px-2 py-1 rounded border border-neon/20 flex items-center gap-1">
            <TrendingUp size={12} />
            +5kg
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-black text-white tracking-tight">80 <span className="text-lg font-medium text-slate-500">kg</span></div>
            <p className="text-xs text-slate-500 mt-1">Previous Best: 75kg</p>
          </div>
          <button className="text-xs font-bold text-slate-300 hover:text-white transition-colors underline decoration-slate-700 underline-offset-4">
            View History
          </button>
        </div>
      </div>
    </div>
  );
}
