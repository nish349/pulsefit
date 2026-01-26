'use client';

import React from 'react';
import DigitalPass from '@/components/member/DigitalPass';
import { currentUser } from '@/lib/mockData';
import { Flame, TrendingDown, ChevronRight, CalendarClock, Dumbbell } from 'lucide-react';

export default function MemberDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24 pt-24 px-4 overflow-hidden relative">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-900 to-slate-950 -z-10" />
       
       <div className="max-w-md mx-auto space-y-8">
           
           {/* Header */}
           <div className="flex justify-between items-end">
               <div>
                   <p className="text-slate-400 text-sm font-medium">Good Morning,</p>
                   <h1 className="text-3xl font-bold text-white tracking-tight">{currentUser.name.split(' ')[0]}</h1>
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                   {/* Avatar Placeholder */}
                   <div className="w-full h-full bg-gradient-to-tr from-emerald-500 to-cyan-500" />
               </div>
           </div>

           {/* Hero: Digital Pass */}
           <section>
               <DigitalPass />
           </section>

           {/* Stats Grid */}
           <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                   <div className="flex items-center gap-2 mb-2 text-orange-500">
                       <Flame size={18} fill="currentColor" />
                       <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
                   </div>
                   <p className="text-2xl font-bold text-white">{currentUser.activeStreak} Days</p>
                   <p className="text-xs text-slate-500">Keep it up!</p>
               </div>
               <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                   <div className="flex items-center gap-2 mb-2 text-blue-500">
                       <TrendingDown size={18} />
                       <span className="text-xs font-bold uppercase tracking-wider">Weight</span>
                   </div>
                   <p className="text-2xl font-bold text-white">{Math.abs(currentUser.weightTrend)}kg</p>
                   <p className="text-xs text-slate-500">Down this month</p>
               </div>
           </div>

           {/* Next Class */}
           <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-5 rounded-2xl relative overflow-hidden group">
               <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
               <div className="relative z-10">
                   <div className="flex justify-between items-start mb-4">
                       <div>
                           <div className="flex items-center gap-2 text-emerald-400 mb-1">
                               <CalendarClock size={16} />
                               <span className="text-xs font-bold uppercase tracking-wider">Up Next</span>
                           </div>
                           <h3 className="text-lg font-bold text-white">{currentUser.nextClass.name}</h3>
                           <p className="text-sm text-slate-400">{currentUser.nextClass.time} • {currentUser.nextClass.instructor}</p>
                       </div>
                       <div className="p-2 bg-slate-700/50 rounded-lg text-white">
                           <Dumbbell size={20} />
                       </div>
                   </div>
                   <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:bg-emerald-500 group-hover:text-slate-900">
                       View Details <ChevronRight size={14} />
                   </button>
               </div>
           </div>

       </div>
    </div>
  );
}
