'use client';

import React from 'react';
import { Activity, BarChart, Users, Calendar, Settings, LogOut, ShieldCheck, TrendingUp, UserCog, CreditCard } from 'lucide-react';
import PanelLayout, { PanelConfig } from '@/components/layout/PanelLayout';

const adminConfig: PanelConfig = {
  panelName: (
    <>
      <div className="w-8 h-8 flex-shrink-0 bg-neon rounded-lg flex items-center justify-center text-slate-950">
        <Activity size={20} className="stroke-[3]" />
      </div>
      <span className="font-bold text-xl text-white tracking-tight hidden md:block group-[.w-64]:block">
        Pulse<span className="text-neon">Admin</span>
      </span>
    </>
  ),
  navItems: [
    { icon: BarChart, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'Members', href: '/admin/members' },
    { icon: Calendar, label: 'Schedule', href: '/admin/schedule' },
    { icon: TrendingUp, label: 'Sales Leads', href: '/admin/leads' },
    { icon: ShieldCheck, label: 'Access Log', href: '/admin/access' },
    { icon: UserCog, label: 'Staff', href: '/admin/staff' },
    { icon: CreditCard, label: 'Manage Plans', href: '/admin/plans' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' }, // Kept Settings just in case or we can ignore
  ],
  userProfile: {
    name: "Marcus Admin",
    role: "Station Manager",
    avatarUrl: "/demo-images/avatar-admin.jpg",
  },
  basePath: '/admin',
  theme: 'admin'
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PanelLayout config={adminConfig}>
      {children}
    </PanelLayout>
  );
}
