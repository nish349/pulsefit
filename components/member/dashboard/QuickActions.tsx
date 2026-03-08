"use client";

import { CalendarPlus, Dumbbell } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card
        className="!p-4 flex flex-col items-center justify-center gap-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group cursor-pointer"
        role="button"
        tabIndex={0}
      >
        <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
          <CalendarPlus size={24} />
        </div>
        <span className="font-semibold text-sm">Book Class</span>
      </Card>

      <Card
        className="!p-4 flex flex-col items-center justify-center gap-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group cursor-pointer"
        role="button"
        tabIndex={0}
      >
        <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Dumbbell size={24} />
        </div>
        <span className="font-semibold text-sm">View Workout</span>
      </Card>
    </div>
  );
}
