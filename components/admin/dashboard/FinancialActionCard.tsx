"use client";

import { useState } from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, TrendingDown, Bell, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export default function FinancialActionCard() {
  const [view, setView] = useState<'revenue' | 'overdue'>('revenue');
  const [reminded, setReminded] = useState(false);

  const handleRemind = () => {
    setReminded(true);
    setTimeout(() => setReminded(false), 3000);
  };

  return (
    <Card className="rounded-2xl hover:border-white/20 transition-all group shadow-xl hover:shadow-2xl hover:-translate-y-1 duration-300 relative overflow-hidden">

      {/* Toggle View */}
      <div className="absolute top-6 right-6 flex bg-slate-800/50 p-1 rounded-lg border border-white/5 z-20">
        <button
          onClick={() => setView('revenue')}
          className={cn("px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all", view === 'revenue' ? "bg-emerald-500 text-slate-950 shadow-lg" : "text-slate-400 hover:text-white")}
        >
          Revenue
        </button>
        <button
          onClick={() => setView('overdue')}
          className={cn("px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all", view === 'overdue' ? "bg-red-500 text-white shadow-lg" : "text-slate-400 hover:text-white")}
        >
          Overdue
        </button>
      </div>

      {view === 'revenue' ? (
        <>
          <div className="flex justify-between items-start mb-6">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-400 border border-white/5 shadow-inner">
              <TrendingUp size={24} strokeWidth={1.5} />
            </div>
            {/* Space for absolute toggle */}
          </div>
          <div className="space-y-1">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Revenue Pulse</h3>
            <div className="text-3xl font-black text-white tracking-tight">₹17.5k</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ArrowUpRight size={12} className="mr-1" /> 12.5%
              </div>
              <div className="text-slate-500 text-xs font-medium">vs ₹15.2k Target</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start mb-6">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-500/5 text-red-500 border border-white/5 shadow-inner animate-pulse">
              <TrendingDown size={24} strokeWidth={1.5} />
            </div>
            {/* Space for absolute toggle */}
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Pending Collections</h3>
              <div className="text-3xl font-black text-white tracking-tight">₹4,500</div>
              <div className="text-red-400 text-xs font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                3 Members Overdue
              </div>
            </div>

            <button
              onClick={handleRemind}
              disabled={reminded}
              className={cn(
                "w-full py-2.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg",
                reminded ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500 text-white hover:bg-red-400 shadow-red-500/20 hover:shadow-red-500/30 active:scale-95"
              )}
            >
              {reminded ? (
                <>
                  <CheckCircle size={14} /> Reminders Sent!
                </>
              ) : (
                <>
                  <Bell size={14} /> Send Reminders
                </>
              )}
            </button>
          </div>
        </>
      )}

    </Card>
  );
}
