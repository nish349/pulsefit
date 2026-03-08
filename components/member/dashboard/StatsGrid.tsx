"use client";

import { Flame, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Attendance Streak */}
      <Card className="!p-5 flex flex-col justify-between group hover:border-white/20 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Streak</p>
            <p className="text-2xl font-black text-white flex items-baseline gap-1">
              12 <span className="text-sm font-medium text-slate-500">Days</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Flame size={20} className="fill-orange-500" />
          </div>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Last visit: Yesterday @ 6:30 PM
        </div>
      </Card>

      {/* Plan Status - Redesigned */}
      <Card className="!p-5 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-all">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-slate-400 font-medium">Plan Status</span>
          <span className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-2 py-1 rounded-lg border border-emerald-500/20">
            Active
          </span>
        </div>

        {/* Plan Name */}
        <div className="mb-4">
          <h3 className="text-2xl font-black text-white tracking-tight">Gold Plan</h3>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-end">
            <span className="text-xs text-slate-400 font-medium">20/30 days</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{ width: '66%' }}
            />
          </div>
        </div>
      </Card>

      {/* Next Payment */}
      <Card className="!p-5 flex items-center justify-between group hover:border-white/20 transition-colors">
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Due in 5 Days</p>
          <p className="text-2xl font-black text-white">₹5000</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
          <CreditCard size={20} />
        </div>
      </Card>
    </div>
  );
}
