import React from 'react';
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';

const systems = [
  { label: "Smart Lockers", status: "Operational", color: "bg-emerald-500", text: "text-emerald-500" },
  { label: "Access Control", status: "Online", color: "bg-emerald-500", text: "text-emerald-500" },
  { label: "HVAC System", status: "Maintenance", color: "bg-amber-500", text: "text-amber-500" },
  { label: "Payment Gateway", status: "Nominal", color: "bg-emerald-500", text: "text-emerald-500" },
  { label: "Member App", status: "Online", color: "bg-emerald-500", text: "text-emerald-500" },
  { label: "Data Backup", status: "Today 02:00 AM", color: "bg-blue-500", text: "text-blue-500" },
];

export default function SystemHealthCard() {
  return (
    <div className="bg-[#161b27] border border-[#1e2a3a] rounded-2xl p-5 flex flex-col h-[240px]">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-slate-200 flex items-center gap-2">
          <Activity size={18} className="text-slate-400" />
          System Health
        </h3>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        {systems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#0d1117] border border-transparent hover:border-[#1e2a3a] transition-colors">
            <div className="flex items-center gap-3">
              <span className={cn("w-2 h-2 rounded-full", item.color)} />
              <span className="text-sm font-bold text-slate-200">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border border-[currentColor]/20 bg-[currentColor]/10", item.text)}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#1e2a3a] text-center">
        <Link href="/admin/settings" className="block text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all w-full">View Report</Link>
      </div>
    </div>
  );
}
