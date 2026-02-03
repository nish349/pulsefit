"use client";

import { Clock, MapPin } from "lucide-react";

const classes = [
  { id: 1, name: "Morning Yoga Flow", time: "10:00 AM", instructor: "Sarah J.", location: "Studio A" },
  { id: 2, name: "HIIT Blast", time: "06:00 PM", instructor: "Mike T.", location: "Zone 2" },
];

export default function UpcomingClasses() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Upcoming Classes</h3>
        <button className="text-xs text-neon font-medium hover:underline">View All</button>
      </div>

      <div className="space-y-2">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white mb-1">{cls.name}</h4>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-slate-500" />
                  {cls.time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={12} className="text-slate-500" />
                  {cls.location}
                </div>
              </div>
            </div>
            <div className="text-right">
              <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
