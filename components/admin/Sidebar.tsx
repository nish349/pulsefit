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
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  { icon: BarChart, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Members', href: '/admin/members' },
  { icon: Calendar, label: 'Schedule', href: '/admin/schedule' },
  { icon: TrendingUp, label: 'Sales Leads', href: '/admin/leads' },
  { icon: ShieldCheck, label: 'Access Control', href: '/admin/access' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
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
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
           {menuItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                    isActive ? "bg-gradient-to-r from-neon/20 to-transparent text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-white",
                    !isOpen && "justify-center"
                  )}
               >
                 {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-neon rounded-r-full" />
                 )}
                 <item.icon size={20} className={cn("flex-shrink-0 transition-transform", isActive ? "text-neon scale-110" : "group-hover:text-slate-300")} />
                 {isOpen && (
                   <span className="font-medium whitespace-nowrap">{item.label}</span>
                 )}
                 {!isOpen && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                       {item.label}
                    </div>
                 )}
               </Link>
             )
           })}
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
