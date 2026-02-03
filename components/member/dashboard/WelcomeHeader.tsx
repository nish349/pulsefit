"use client";

import { useMemo } from "react";

export default function WelcomeHeader() {
  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, []);


  const crowdStatus = useMemo(() => {
    // Mock logic - randomly pick one for now or just hardcode as requested
    // returning { status: "Moderate", color: "text-yellow-400", bg: "bg-yellow-400/10" };
    return { status: "Moderate", color: "text-amber-400", bg: "bg-amber-400/10" };
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-black text-white tracking-tight">
        Good Morning, <span className="text-neon">Nishant</span>
      </h1>
      <div className="flex items-center gap-2">
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
          {today}
        </p>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${crowdStatus.bg} ${crowdStatus.color} border border-white/5`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {crowdStatus.status}
        </div>
      </div>
    </div>
  );
}
