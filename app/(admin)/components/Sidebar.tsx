'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ListTodo, 
  Calendar,
  ClipboardList,
  Wrench,
  CreditCard,
  Banknote,
  UserCog,
  Fingerprint,
  Settings,
  ChevronLeft,
  ChevronRight,
  Dumbbell
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    category: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    category: 'CRM & Growth',
    items: [
      { label: 'All Members', href: '/admin/members', icon: Users },
      { label: 'Leads Pipeline', href: '/admin/leads', icon: ListTodo },
    ],
  },
  {
    category: 'Operations',
    items: [
      { label: 'Class Schedule', href: '/admin/schedule', icon: Calendar },
      { label: 'Bookings', href: '/admin/bookings', icon: ClipboardList },
    ],
  },
  {
    category: 'Asset Management',
    items: [
      { label: 'Inventory', href: '/admin/inventory', icon: Dumbbell },
      { label: 'Maintenance', href: '/admin/maintenance', icon: Wrench },
    ],
  },
  {
    category: 'Financials',
    items: [
      { label: 'Transactions', href: '/admin/transactions', icon: CreditCard },
      { label: 'Payroll', href: '/admin/payroll', icon: Banknote },
    ],
  },
  {
    category: 'Staff & Security',
    items: [
      { label: 'Team Roster', href: '/admin/team', icon: UserCog },
      { label: 'Access Logs', href: '/admin/access', icon: Fingerprint },
    ],
  },
  {
    category: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "h-screen bg-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col relative shrink-0",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-slate-800 border border-slate-700 text-slate-400 rounded-full p-1 hover:bg-slate-700 hover:text-white transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header */}
      <div className="p-4 flex items-center justify-center border-b border-slate-800/50 h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-white tracking-wider hover:opacity-80 transition-opacity">
           {isCollapsed ? (
             <span className="text-xl text-emerald-500">P</span>
           ) : (
             <>
               <span className="text-emerald-500">PULSE</span>
               <span className="text-slate-300">FIT</span>
               <span className="text-[10px] bg-slate-800 text-slate-400 py-0.5 px-1.5 rounded ml-2 mt-0.5">ADMIN</span>
             </>
           )}
        </Link>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-800">
        {menuItems.map((group, idx) => (
          <div key={idx} className="mb-6 px-3">
             {!isCollapsed && (
               <h3 className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest px-2">
                 {group.category}
               </h3>
             )}
             <div className="space-y-1">
               {group.items.map((item) => {
                 const isActive = pathname === item.href;
                 return (
                   <Link
                     key={item.href}
                     href={item.href}
                     title={isCollapsed ? item.label : undefined}
                     className={cn(
                       "flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-all group relative",
                       isActive
                         ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                         : "text-slate-400 hover:bg-slate-900 hover:text-slate-200",
                       isCollapsed && "justify-center px-0"
                     )}
                   >
                     <item.icon size={18} className={cn(isActive && "text-emerald-400")} />
                     {!isCollapsed && <span>{item.label}</span>}
                     {/* Tooltip for collapsed state could go here but using title for simplicity */}
                   </Link>
                 );
               })}
             </div>
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300 font-bold border border-slate-700">
            AD
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm text-slate-200 font-medium">Admin User</span>
              <span className="text-xs text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
