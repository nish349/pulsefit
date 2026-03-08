'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useGymStore } from '@/lib/store';
import { TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign, ArrowUpRight, Receipt, Bell } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

const mockLeadsData = [
    { id: '1', name: 'Emily White', contact: 'emily@example.com', status: 'New', source: 'Instagram', date: 'Today' },
    { id: '2', name: 'David Lee', contact: 'david.l@example.com', status: 'Contacted', source: 'Walk-in', date: 'Yesterday' },
    { id: '3', name: 'Sophie Turner', contact: 'sophie@example.com', status: 'Trial', source: 'Website', date: '2 days ago' },
];

const fees = [
    { id: 'f1', member: 'James Smith', type: 'Renewal', amount: '₹5,000', status: 'Received', date: 'Today' },
    { id: 'f2', member: 'Maria Garcia', type: 'Pending Dues', amount: '₹3,000', status: 'Pending', date: 'Yesterday', alert: true },
    { id: 'f3', member: 'Alex Johnson', type: 'Personal Training', amount: '₹12,000', status: 'Received', date: 'Oct 24' },
];

const renewals = [
    { id: 'r1', member: 'Linda Brown', plan: 'Basic', expiry: '2 days', status: 'At Risk' },
    { id: 'r2', member: 'Robert Wilson', plan: 'Enterprise', expiry: '5 days', status: 'Likely' },
];

export default function LeadsPage() {
    const { leads, setLeads } = useGymStore();
    const [remindedIds, setRemindedIds] = useState<Set<string>>(new Set());

    // Use store leads if available, else show mock (or empty if you prefer)
    // For "Full Backend", we should rely on store. If store empty, assume empty.
    // But for demo continuity, let's seed mock if empty?
    // Let's just display what's in store.

    const displayLeads = leads && leads.length > 0 ? leads : [];

    // Quick seed for demo if empty (optional, but good for user experience initially)
    useEffect(() => {
        if (!leads || leads.length === 0) {
            // setLeads(mockLeadsData); // Uncomment to auto-seed
        }
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Sales Leads</h1>
                    <p className="text-slate-400 text-sm">Revenue tracking and member acquisition pipeline.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-neon hover:bg-neon/90 text-slate-950 font-bold rounded-lg transition-colors shadow-lg shadow-neon/20">
                    <ArrowUpRight size={18} />
                    Export Report
                </button>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <TrendingUp size={16} />
                        </div>
                        <span className="text-slate-400 text-xs font-bold uppercase">New Leads</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{displayLeads.length}</div>
                    <div className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                        <ArrowUpRight size={10} /> +15% vs last week
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <DollarSign size={16} />
                        </div>
                        <span className="text-slate-400 text-xs font-bold uppercase">Fees Received</span>
                    </div>
                    <div className="text-2xl font-bold text-white">₹45.2k</div>
                    <div className="text-xs text-slate-500 mt-1">This Month</div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors" />
                    <div className="flex items-center gap-3 mb-2 relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <AlertCircle size={16} />
                        </div>
                        <span className="text-slate-400 text-xs font-bold uppercase">Pending Fees</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-500 relative z-10">₹8,500</div>
                    <div className="text-xs text-amber-400/80 mt-1 relative z-10">3 Members overdue</div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <Clock size={16} />
                        </div>
                        <span className="text-slate-400 text-xs font-bold uppercase">Renewal (&lt;7 Days)</span>
                    </div>
                    <div className="text-2xl font-bold text-white">5</div>
                    <div className="text-xs text-slate-500 mt-1">Acitve Members</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Feed */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/30">
                        <h3 className="font-bold text-white">Recent Transactions</h3>
                        <button className="text-xs text-emerald-500 hover:text-emerald-400 font-medium">View All</button>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                        {fees.length === 0 ? (
                            <EmptyState
                                icon={Receipt}
                                title="No recent transactions"
                                description="When members make payments, they will appear here."
                                compact
                            />
                        ) : (
                            fees.map((fee) => (
                                <div key={fee.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", fee.alert ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500")}>
                                            <DollarSign size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{fee.member}</div>
                                            <div className="text-xs text-slate-500">{fee.type}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={cn("font-bold text-sm", fee.alert ? "text-amber-500" : "text-white")}>{fee.amount}</div>
                                        <div className="text-xs text-slate-500">{fee.status}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Renewal Alerts */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/30">
                        <h3 className="font-bold text-white">Upcoming Renewals</h3>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                        {renewals.length === 0 ? (
                            <EmptyState
                                icon={Bell}
                                title="No upcoming renewals"
                                description="Memberships nearing expiry will show up here."
                                compact
                            />
                        ) : (
                            renewals.map((r) => {
                                const isReminded = remindedIds.has(r.id);
                                return (
                                    <div key={r.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                                        <div>
                                            <div className="text-sm font-bold text-white">{r.member}</div>
                                            <div className="text-xs text-slate-500">{r.plan} Plan</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-xs text-slate-400">Expires in</div>
                                                <div className="text-sm font-bold text-red-400">{r.expiry}</div>
                                            </div>
                                            <button
                                                onClick={() => setRemindedIds(prev => new Set(prev).add(r.id))}
                                                disabled={isReminded}
                                                className={cn(
                                                    "px-3 py-1 text-xs font-medium rounded transition-colors",
                                                    isReminded
                                                        ? "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                                                        : "bg-slate-800 text-white hover:bg-emerald-600"
                                                )}
                                            >
                                                {isReminded ? 'Sent' : 'Remind'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
