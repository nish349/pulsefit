"use client";

import { Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const staff = [
  { name: "Rahul", role: "PT Floor", status: "Online", time: "06:00 AM" },
  { name: "Sarah", role: "Front Desk", status: "Online", time: "08:00 AM" },
  { name: "Mike", role: "Maintenance", status: "Break", time: "07:30 AM" },
  { name: "Priya", role: "Yoga Instr", status: "Online", time: "09:00 AM" },
];

export default function ActiveStaffCard() {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group shadow-xl hover:shadow-2xl hover:-translate-y-1 duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 text-indigo-400 border border-white/5 shadow-inner">
          <Users size={24} strokeWidth={1.5} />
        </div>
        <div className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-white/5 uppercase tracking-wider">
          Live
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Staff on Duty</h3>
        <div className="text-3xl font-black text-white tracking-tight">{staff.filter(s => s.status === 'Online').length} <span className="text-lg text-slate-500 font-medium">Active</span></div>
      </div>

      <div className="space-y-3 flex-1 overflow-auto custom-scrollbar pr-1">
        {staff.map((member, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group/item">
            <div className="flex items-center gap-3">
              <div className={cn("w-2 h-2 rounded-full ring-2 ring-slate-900", member.status === 'Online' ? "bg-emerald-500" : "bg-amber-500")} />
              <div>
                <div className={cn("text-sm font-bold", member.status === 'Online' ? "text-white" : "text-slate-500")}>{member.name}</div>
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{member.role}</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-600 font-mono">{member.time}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 text-center">
        <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all">View Schedule</button>
      </div>
    </div>
  );
}
