'use client';

import React from 'react';
import Link from 'next/link';

import LiveOccupancyCard from '@/components/admin/dashboard/LiveOccupancyCard';
import RevenuePulseCard from '@/components/admin/dashboard/RevenuePulseCard';
import SystemHealthCard from '@/components/admin/dashboard/SystemHealthCard';
import AdminNotesCard from '@/components/admin/dashboard/AdminNotesCard';
import TodayScheduleSummaryCard from '@/components/admin/dashboard/TodayScheduleSummaryCard';
import RecentActivityCard from '@/components/admin/dashboard/RecentActivityCard';

export default function AdminDashboard() {
    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">Dashboard</h1>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">System Status:</span>
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Nominal
                        </span>

                        <span className="mx-2 text-slate-700">|</span>

                        <span className="text-slate-400">Staff on Duty:</span>
                        <Link href="/admin/staff" className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs uppercase tracking-wider hover:bg-indigo-500/20 transition-colors">
                            3 Active
                        </Link>
                    </div>
                </div>
            </div>

            {/* Row 1: Live Occupancy | Revenue Pulse | System Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                <LiveOccupancyCard />
                <RevenuePulseCard />
                <SystemHealthCard />
            </div>

            {/* Row 2: Admin Notes | Today's Schedule Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <AdminNotesCard />
                <TodayScheduleSummaryCard />
            </div>

            {/* Row 3: Recent Activity Feed */}
            <div>
                <RecentActivityCard />
            </div>
        </div>
    );
}
