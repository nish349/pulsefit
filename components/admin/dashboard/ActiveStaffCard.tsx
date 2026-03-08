import React from 'react';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const staff = [
  { name: "Rahul", role: "PT Floor", status: "Online", time: "06:00 AM" },
  { name: "Sarah", role: "Front Desk", status: "Online", time: "08:00 AM" },
  { name: "Mike", role: "Maintenance", status: "Break", time: "07:30 AM" },
  { name: "Priya", role: "Yoga Instr", status: "Online", time: "09:00 AM" },
];

export default function ActiveStaffCard() {
  const activeCount = staff.filter(s => s.status === 'Online').length;

  return (
    <div className="bg-[#161b27] border border-[#1e2a3a] rounded-2xl p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-5">
        <h3 className="font-bold text-slate-200 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users size={14} className="stroke-[3]" />
          </div>
          Staff on Duty
        </h3>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold text-[10px] uppercase tracking-wider border border-[#1e2a3a]">
          Live
        </span>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-black text-white flex items-baseline gap-2">
          {activeCount} <span className="text-sm font-medium text-slate-500">Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {staff.map((member, i) => (
          <div key={i} className="flex justify-between items-center bg-[#0d1117] p-3 rounded-xl border border-transparent hover:border-[#1e2a3a] transition-colors">
            <div className="flex items-center gap-3">
              <div className={cn("w-2 h-2 rounded-full", member.status === 'Online' ? "bg-emerald-500" : "bg-amber-500")} />
              <div>
                <div className="text-sm font-bold text-slate-200">{member.name}</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{member.role}</div>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {member.time}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-[#1e2a3a]">
        <Link href="/admin/staff" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest block text-center w-full">
          View Schedule
        </Link>
      </div>
    </div>
  );
}
