'use client';

import React from 'react';
import { LayoutDashboard, Calendar, Dumbbell, CreditCard, Settings, Activity } from 'lucide-react';
import PanelLayout, { PanelConfig } from '@/components/layout/PanelLayout';

const memberConfig: PanelConfig = {
  panelName: (
    <>
      <div className="w-8 h-8 rounded-lg bg-neon flex items-center justify-center text-slate-950">
        <Activity size={20} strokeWidth={3} />
      </div>
      <span className="font-black text-xl text-white tracking-tight hidden md:block group-[.sidebar-open]:block">
        PULSE<span className="text-neon">FIT</span>
      </span>
    </>
  ),
  navItems: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Schedule", href: "/dashboard/schedule", icon: Calendar },
    { label: "Workouts", href: "/dashboard/workouts", icon: Dumbbell },
    { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
  userProfile: {
    name: "Member User",
    role: "Premium Plan",
    initials: "ME"
  },
  basePath: '/dashboard',
  theme: 'member'
};

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PanelLayout config={memberConfig}>
      {children}
    </PanelLayout>
  );
}
