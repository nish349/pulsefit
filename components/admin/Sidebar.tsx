'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Users,
  Calendar,
  Settings,
  LogOut,
  Activity,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserCog,
  Plus,
  CreditCard,
  PieChart
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuGroups = [
  {
    name: 'Operations',
    items: [
      { icon: BarChart, label: 'Dashboard', href: '/admin' },
      { icon: Users, label: 'Members', href: '/admin/members' },
      { icon: Calendar, label: 'Schedule', href: '/admin/schedule' },
      { icon: ShieldCheck, label: 'Access Log', href: '/admin/access' },
    ]
  },
  {
    name: 'Growth & Revenue',
    items: [
      { icon: TrendingUp, label: 'Sales Leads', href: '/admin/leads' },
      { icon: PieChart, label: 'Reports & Analytics', href: '#', disabled: true },
    ]
  },
  {
    name: 'People',
    items: [
      { icon: UserCog, label: 'Staff', href: '/admin/staff' },
    ]
  },
  {
    name: 'Configuration',
    items: [
      { icon: CreditCard, label: 'Membership Plans', href: '/admin/plans' },
      { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ]
  }
];

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-[#0a0f1c] border-r border-slate-800",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex flex-col h-full bg-[#0a0f1c]">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/50">
          <Link href="/admin" className={cn("flex items-center gap-2 overflow-hidden whitespace-nowrap", !isOpen && "justify-center w-full")}>
            <div className="w-8 h-8 flex-shrink-0 bg-neon rounded-lg flex items-center justify-center text-slate-950">
              <Activity size={20} className="stroke-[3]" />
            </div>
            {isOpen && (
              <span className="font-bold text-xl text-white tracking-tight">Pulse<span className="text-neon">Admin</span></span>
            )}
          </Link>
        </div>



        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group, groupIndex) => (
            <div key={group.name} className={cn("mb-6", groupIndex === menuGroups.length - 1 && "mb-0")}>
              {/* Group Label / Subtext (Visible when Open) */}
              {isOpen ? (
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {group.name}
                </div>
              ) : (
                /* Subtle divider when closed (except first item) */
                groupIndex !== 0 && <div className="mx-4 my-4 border-t border-slate-800/50" />
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin' && item.href !== '#');

                  // Using an 'any' cast here or dynamic tag to cleanly support disabled tags vs Links without duplicating code block
                  const Element = item.disabled ? 'div' : Link;

                  return (
                    // @ts-ignore
                    <Element
                      key={item.label}
                      {...(item.disabled ? {} : { href: item.href })}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                        item.disabled
                          ? "opacity-50 cursor-not-allowed select-none"
                          : isActive
                            ? "bg-gradient-to-r from-neon/20 to-transparent text-white"
                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white",
                        !isOpen && "justify-center"
                      )}
                    >
                      {isActive && !item.disabled && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-neon rounded-r-full" />
                      )}
                      <item.icon size={20} className={cn("flex-shrink-0 transition-transform", (isActive && !item.disabled) ? "text-neon scale-110" : "group-hover:text-slate-300")} />

                      {isOpen && (
                        <span className="font-medium whitespace-nowrap">{item.label} {item.disabled && <span className="ml-2 text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-widest">Soon</span>}</span>
                      )}

                      {/* Tooltip for closed state */}
                      {!isOpen && (
                        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                          {item.label} {item.disabled && "(Coming Soon)"}
                        </div>
                      )}
                    </Element>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User / Footer */}
        <div className="p-4 border-t border-slate-800/50 bg-[#0a0f1c]">
          <button className={cn("flex items-center gap-3 w-full text-left p-2 rounded-xl hover:bg-slate-800/50 transition-colors group", !isOpen && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[1px]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <img src="/demo-images/avatar-admin.jpg" alt="Admin" className="w-full h-full object-cover opacity-90" />
              </div>
            </div>
            {isOpen && (
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-bold text-white truncate">Marcus Admin</div>
                <div className="text-xs text-slate-500 truncate">Station Manager</div>
              </div>
            )}
            {isOpen && <LogOut size={16} className="text-slate-500 group-hover:text-red-400 transition-colors" />}
          </button>
        </div>

        {/* Toggle Button (Floating) */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-50"
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>
    </aside>
  );
}
