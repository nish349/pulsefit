import React from 'react';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

const schedule = [
  { time: "06:00 AM", class: "HIIT Bootcamp", instructor: "Rahul" },
  { time: "09:00 AM", class: "Vinyasa Flow", instructor: "Priya" },
  { time: "05:00 PM", class: "Spin Class", instructor: "Alex" },
  { time: "07:00 PM", class: "Boxing Fundamentals", instructor: "Sarah" },
];

export default function TodayScheduleSummaryCard() {
  return (
    <div className="bg-[#161b27] border border-[#1e2a3a] rounded-2xl p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-5">
        <h3 className="font-bold text-slate-200 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
            <Calendar size={14} className="stroke-[3]" />
          </div>
          Today's Schedule
        </h3>
        <span className="text-[10px] font-bold text-slate-500 bg-[#0d1117] px-2 py-0.5 rounded border border-[#1e2a3a] uppercase tracking-wider">
          {schedule.length} Events
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {schedule.map((item, i) => (
          <div key={i} className="flex gap-4 p-3 bg-[#0d1117] rounded-xl border border-transparent hover:border-[#1e2a3a] transition-colors">
            <div className="text-xs font-bold text-slate-400 pt-0.5 w-16 shrink-0">{item.time}</div>
            <div>
              <div className="text-sm font-bold text-slate-200">{item.class}</div>
              <div className="text-[11px] text-slate-500 font-medium">with {item.instructor}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-[#1e2a3a]">
        <Link href="/admin/schedule" className="text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors uppercase tracking-widest block text-center w-full">
          View Full Schedule
        </Link>
      </div>
    </div>
  );
}
