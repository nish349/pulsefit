"use client";

import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const systems = [
  { label: "Smart Lockers", status: "Operational", color: "bg-emerald-500", text: "text-emerald-500", eta: null },
  { label: "Access Control", status: "Online", color: "bg-emerald-500", text: "text-emerald-500", eta: null },
  { label: "HVAC System", status: "Maintenance", color: "bg-amber-500", text: "text-amber-500", eta: "4:00 PM" },
];

export default function SystemHealthCard() {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl h-full flex flex-col">
      <h3 className="font-bold text-white mb-5 flex items-center gap-2">
        <Activity size={18} className="text-slate-400" />
        System Health
      </h3>
      <div className="space-y-2 flex-1">
        {systems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default group">
            <div className="flex items-center gap-3">
              <span className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] opacity-80 group-hover:opacity-100 transition-opacity", item.color, item.text)} />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.eta && (
                <span className="text-[10px] font-mono text-amber-500/80 hidden group-hover:block animate-in fade-in slide-in-from-right-2">
                  ETA: {item.eta}
                </span>
              )}
              <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors", item.text)}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
