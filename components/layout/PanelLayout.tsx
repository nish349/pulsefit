"use client";

import React, { useState } from 'react';
import AppSidebar from '@/components/layout/AppSidebar';
import AppMobileNav from '@/components/layout/AppMobileNav';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl?: string;
  initials?: string;
}

export interface PanelConfig {
  panelName: React.ReactNode;
  navItems: NavItem[];
  userProfile: UserProfile;
  basePath: string;
  theme?: 'admin' | 'member';
}

interface PanelLayoutProps {
  children: React.ReactNode;
  config: PanelConfig;
}

export default function PanelLayout({ children, config }: PanelLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Default theme is the admin slate-950 background, but allow customization later via CSS classes 
  // if member requires it. Both seem to use slate-950/black right now.
  const isMember = config.theme === 'member';

  return (
    <div className={`flex min-h-screen ${isMember ? 'bg-black' : 'bg-slate-950'} text-slate-200 overflow-hidden font-sans selection:bg-neon/30`}>
      {/* Mobile Nav */}
      <AppMobileNav config={config} />

      {/* Desktop Sidebar */}
      <AppSidebar
        config={config}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 relative ${isMember ? 'pt-16 md:pt-0' : 'overflow-y-auto'}`}>
        {/* Admin specific background embellishment */}
        {!isMember && (
          <>
            <div className="absolute inset-0 bg-[#0B0F17] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none z-0" />
          </>
        )}
        <div className={`relative z-10 p-4 md:p-8 max-w-7xl mx-auto ${isSidebarOpen && !isMember ? '' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
