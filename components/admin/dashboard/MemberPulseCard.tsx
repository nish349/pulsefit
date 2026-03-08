import React from 'react';
import { Users } from 'lucide-react';

export default function MemberPulseCard() {
  const activeToday = 245;
  const newThisWeek = 18;
  const expiringThisWeek = 42;

  return (
    <div className="bg-[#161b27] border border-[#1e2a3a] rounded-2xl p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-200 flex items-center gap-2 text-sm">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Users size={14} className="stroke-[3]" />
          </div>
          Member Pulse
        </h3>
      </div>

      <div className="flex flex-col gap-4 mt-auto">
        <div className="flex justify-between items-end border-b border-[#1e2a3a] pb-3">
          <span className="text-sm font-medium text-slate-400">Active Today</span>
          <span className="text-2xl font-black text-white">{activeToday}</span>
        </div>
        <div className="flex justify-between items-end border-b border-[#1e2a3a] pb-3">
          <span className="text-sm font-medium text-slate-400">New This Week</span>
          <span className="text-xl font-bold text-emerald-400">+{newThisWeek}</span>
        </div>
        <div className="flex justify-between items-end pb-1">
          <span className="text-sm font-medium text-slate-400">Expiring This Week</span>
          <span className="text-xl font-bold text-amber-500">{expiringThisWeek}</span>
        </div>
      </div>
    </div>
  );
}
