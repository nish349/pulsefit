import React from 'react';
import { Member } from '@/lib/mock/members';
import { Users, Activity, Clock, FileWarning, Snowflake } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthBarProps {
  members: Member[];
}

export function HealthBar({ members }: HealthBarProps) {
  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'Active').length,
    expiringSoon: members.filter(m => m.status === 'Expiring Soon').length,
    expired: members.filter(m => m.status === 'Expired').length,
    frozen: members.filter(m => m.status === 'Frozen').length,
  };

  const cards = [
    { label: 'Total', value: stats.total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active', value: stats.active, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Expiring Soon', value: stats.expiringSoon, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Expired', value: stats.expired, icon: FileWarning, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Frozen', value: stats.frozen, icon: Snowflake, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((c, i) => (
        <div key={i} className="bg-[#161b27] border border-[#1e2a3a] rounded-xl p-4 flex items-center gap-3 animate-[fadeIn_0.3s_ease] transition-all hover:bg-[#1a2235]">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', c.bg, c.color)}>
            <c.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">{c.label}</div>
            <div className="text-xl font-bold text-slate-100">{c.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
