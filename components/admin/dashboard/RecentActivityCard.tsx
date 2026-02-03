"use client";

import { Activity, MoreHorizontal, CreditCard, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RecentActivityCard() {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <Activity size={18} className="text-slate-400" />
          Recent Activity
        </h3>
        <button className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors"><MoreHorizontal size={20} /></button>
      </div>
      <div className="divide-y divide-white/5">
        {[1, 2, 3, 4, 5].map((item, i) => (
          <div key={i} className="flex items-center gap-5 p-5 hover:bg-white/[0.02] transition-colors group">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/5 shadow-inner transition-colors",
              i % 2 === 0 ? "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 group-hover:scale-105" : "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20 group-hover:scale-105"
            )}>
              {i % 2 === 0 ? <CreditCard size={20} /> : <Users size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate mb-0.5 group-hover:text-neon transition-colors">
                {i % 2 === 0 ? "Membership Payment Recieved" : "New Member Registration"}
              </p>
              <p className="text-xs text-slate-400 truncate font-medium">
                {i % 2 === 0 ? "Alice Freeman - yearly plan" : "Marcus Jones joined as Basic Tier"}
              </p>
            </div>
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 bg-slate-950/30 px-2 py-1 rounded-lg border border-white/5">
              <Clock size={12} />
              {i * 15 + 2}m ago
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
        <button className="text-xs text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all">View All Activity</button>
      </div>
    </div>
  );
}
