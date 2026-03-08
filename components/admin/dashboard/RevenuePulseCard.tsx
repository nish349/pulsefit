'use client';

import React, { useState } from 'react';
import { IndianRupee, AlertCircle } from 'lucide-react';

export default function RevenuePulseCard() {
  const [view, setView] = useState<'revenue' | 'overdue'>('revenue');

  const todayRevenue = 45000;
  const targetPercent = 112;
  const overdueAmount = 12500;
  const overdueCount = 3;

  return (
    <div className="bg-[#161b27] border border-[#1e2a3a] rounded-2xl p-5 flex flex-col h-[240px]">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-bold text-slate-200 flex items-center gap-2 text-sm">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <IndianRupee size={14} className="stroke-[3]" />
          </div>
          Financials
        </h3>

        <div className="flex items-center bg-[#0d1117] rounded-lg p-0.5 border border-[#1e2a3a]">
          <button
            onClick={() => setView('revenue')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${view === 'revenue' ? 'bg-[#1e2a3a] text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Revenue
          </button>
          <button
            onClick={() => setView('overdue')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${view === 'overdue' ? 'bg-amber-500/20 text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Overdue
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-auto">
        {view === 'revenue' ? (
          <>
            <div className="text-3xl font-black text-white flex items-center">
              ₹{todayRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-sm font-medium text-emerald-400 flex items-center gap-1 mt-1">
              ↑ {targetPercent}% vs. daily target
            </div>

            <div className="mt-4 pt-4 border-t border-[#1e2a3a] text-center">
              <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all w-full">View Report</button>
            </div>
          </>
        ) : (
          <>
            <div className="text-3xl font-black text-amber-500 flex items-center">
              ₹{overdueAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-sm font-medium text-slate-400 flex items-center gap-1 mt-1 mb-2">
              <AlertCircle size={14} className="text-amber-500" /> {overdueCount} members pending payment
            </div>

            <div className="mt-4 pt-4 border-t border-[#1e2a3a] text-center">
              <button className="text-xs text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all w-full">Send Notifications</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
