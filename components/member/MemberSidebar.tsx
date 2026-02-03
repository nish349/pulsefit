"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Dumbbell,
  CreditCard,
  Settings,
  LogOut,
  Activity
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Schedule", href: "/dashboard/schedule", icon: Calendar },
  { label: "Workouts", href: "/dashboard/workouts", icon: Dumbbell },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function MemberSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[250px] h-screen bg-slate-950 border-r border-slate-800 flex-col hidden md:flex fixed left-0 top-0 z-40">
      {/* Header / Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neon flex items-center justify-center text-slate-950">
            <Activity size={20} strokeWidth={3} />
          </div>
          <span className="font-black text-xl text-white tracking-tight">
            PULSE<span className="text-neon">FIT</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium group relative",
                isActive
                  ? "bg-neon/10 text-neon"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-neon rounded-r-full" />
              )}
              <item.icon size={20} className={cn(isActive && "text-neon")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <span className="text-white font-bold">ME</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-bold text-white truncate">Member User</div>
            <div className="text-xs text-slate-500 truncate">Premium Plan</div>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
