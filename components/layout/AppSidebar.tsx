"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { PanelConfig, NavItem } from "@/components/layout/PanelLayout";


export default function AppSidebar({
  config,
  isOpen,
  toggleSidebar,
}: {
  config: PanelConfig;
  isOpen: boolean;
  toggleSidebar?: () => void;
}) {
  const pathname = usePathname();
  const isMember = config.theme === 'member';

  return (
    <aside
      className={cn(
        "group fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-slate-800 flex flex-col",
        isMember ? "bg-slate-950 hidden md:flex" : "bg-[#0a0f1c]",
        isOpen ? (isMember ? "w-[250px] sidebar-open" : "w-64 sidebar-open") : (isMember ? "w-20" : "w-20")
      )}
    >
      <div className={cn("flex flex-col h-full", isMember ? "bg-slate-950" : "bg-[#0a0f1c]")}>
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b border-slate-800/50 justify-between">
          <Link href={config.basePath} className={cn("flex items-center gap-2 overflow-hidden whitespace-nowrap", !isOpen && "justify-center w-full")}>
            {config.panelName}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {config.navItems.map((item: NavItem) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== config.basePath);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-gradient-to-r from-neon/20 to-transparent text-neon"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white",
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
            );
          })}
        </nav>

        {/* User Footer */}
        <div className={cn("p-4 border-t border-slate-800/50", isMember ? "bg-slate-900/50" : "bg-[#0a0f1c]")}>
          <button className={cn("flex items-center gap-3 w-full text-left p-2 rounded-xl hover:bg-slate-800/50 transition-colors group", !isOpen && "justify-center")}>
            <div className={cn("w-10 h-10 rounded-full p-[1px] flex items-center justify-center",
              isMember ? "bg-slate-800 border border-slate-700" : "bg-gradient-to-tr from-emerald-500 to-cyan-500"
            )}>
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                {config.userProfile.avatarUrl ? (
                  <img src={config.userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover opacity-90" />
                ) : (
                  <span className="text-white font-bold">{config.userProfile.initials || "ME"}</span>
                )}
              </div>
            </div>
            {isOpen && (
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-bold text-white truncate">{config.userProfile.name}</div>
                <div className="text-xs text-slate-500 truncate">{config.userProfile.role}</div>
              </div>
            )}
            {isOpen && <LogOut size={16} className="text-slate-500 group-hover:text-red-400 transition-colors" />}
          </button>
        </div>

        {/* Toggle Button (Admin only typically, but available to both) */}
        {!isMember && toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-50"
          >
            {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
      </div>
    </aside>
  );
}
