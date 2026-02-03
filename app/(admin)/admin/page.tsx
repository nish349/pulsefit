'use client';

import React from 'react';
import { Users } from 'lucide-react';

import OccupancyController from '@/components/admin/OccupancyController';
import ActiveStaffCard from '@/components/admin/dashboard/ActiveStaffCard';
import FinancialActionCard from '@/components/admin/dashboard/FinancialActionCard';
import SystemHealthCard from '@/components/admin/dashboard/SystemHealthCard';
import AccessControlCard from '@/components/admin/dashboard/AccessControlCard';
import RecentActivityCard from '@/components/admin/dashboard/RecentActivityCard';

export default function AdminDashboard() {

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">Admin Panel</h1>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">System Status:</span>
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Nominal
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
                        Generate Report
                    </button>
                    <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95 flex items-center gap-2">
                        <Users size={18} />
                        Add Member
                    </button>
                </div>
            </div>

            {/* Masonry Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Column 1: Occupancy & Health */}
                <div className="flex flex-col gap-6">
                    <OccupancyController />
                    <div className="flex-1">
                        <SystemHealthCard />
                    </div>
                </div>

                {/* Column 2: Finance & Access */}
                <div className="flex flex-col gap-6">
                    <FinancialActionCard />
                    <div className="flex-1">
                        <AccessControlCard />
                    </div>
                </div>

                {/* Column 3: Active Staff (Full Height) */}
                <div className="h-full">
                    <ActiveStaffCard />
                </div>
            </div>

            {/* Bottom Section: Recent Activity */}
            <div>
                <RecentActivityCard />
            </div>
        </div>
    );
}
