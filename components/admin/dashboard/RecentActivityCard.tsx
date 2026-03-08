import React, { useState } from 'react';
import { Activity, MoreHorizontal, CreditCard, Users, ShieldAlert, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RecentActivityCard() {
  const [menuOpen, setMenuOpen] = useState(false);

  const activities = [
    { id: 1, type: "payment", title: "Membership Payment Received", desc: "Alice Freeman - yearly plan", time: "2m ago", icon: CreditCard, color: "bg-emerald-500/10 text-emerald-500" },
    { id: 2, type: "registration", title: "New Member Registration", desc: "Marcus Jones joined as Basic Tier", time: "17m ago", icon: Users, color: "bg-blue-500/10 text-blue-500" },
    { id: 3, type: "access", title: "Access Denied", desc: "Unknown fingerprint at Main Entrance", time: "1h ago", icon: ShieldAlert, color: "bg-red-500/10 text-red-500" },
    { id: 4, type: "plan", title: "Plan Change", desc: "Sarah Connor upgraded to Platinum", time: "3h ago", icon: FileText, color: "bg-purple-500/10 text-purple-500" },
    { id: 5, type: "payment", title: "Membership Payment Received", desc: "John Smith - monthly plan", time: "5h ago", icon: CreditCard, color: "bg-emerald-500/10 text-emerald-500" },
  ];

  return (
    <div className="bg-[#161b27] border border-[#1e2a3a] rounded-2xl overflow-hidden flex flex-col max-h-[350px]">
      <div className="p-4 border-b border-[#1e2a3a] flex justify-between items-center bg-[#1a2235]">
        <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
          <Activity size={16} className="text-slate-400" />
          Recent Activity
        </h3>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-md transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute top-full right-0 mt-1 w-32 bg-[#1a2235] border border-[#1e2a3a] rounded-lg shadow-xl z-50 overflow-hidden py-1">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-[#1e2a3a] hover:text-white transition-colors"
                >
                  Mark all read
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-[#1e2a3a]">
        {activities.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-slate-800/50 transition-colors">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-transparent", item.color)}>
              <item.icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-200 truncate mb-0.5">
                {item.title}
              </p>
              <p className="text-xs text-slate-500 truncate font-medium">
                {item.desc}
              </p>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {item.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
