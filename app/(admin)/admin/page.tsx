'use client';

import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { members, financialRecords, currentUser } from '@/lib/mockData';
import { useGymStore } from '@/lib/store';
import { Fingerprint, ScanLine } from 'lucide-react';

import OccupancyController from '@/components/admin/OccupancyController';

const StatCard = ({ title, value, subValue, trend, icon: Icon, color }: any) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2 rounded-lg bg-opacity-10", color === 'emerald' ? 'bg-emerald-500 text-emerald-500' : color === 'blue' ? 'bg-blue-500 text-blue-500' : 'bg-purple-500 text-purple-500')}>
        <Icon size={20} />
      </div>
      {trend && (
        <div className={cn("flex items-center text-xs font-medium px-2 py-1 rounded-full", trend > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")}>
          {trend > 0 ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-slate-500 text-xs">{subValue}</div>
  </div>
);

export default function AdminDashboard() {
  // Mock Calculations
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const frozenMembers = members.filter(m => m.status === 'Frozen').length;
  const churnRate = 2.4; // constant for now
  const monthlyRevenue = financialRecords.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mission Control</h1>
          <p className="text-slate-400 text-sm">Welcome back. System status: <span className="text-emerald-500 font-medium">Nominal</span></p>
        </div>
        <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors border border-slate-700">
                Generate Report
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20">
                Add Member
            </button>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OccupancyController />
        
        <StatCard 
            title="Revenue Pulse" 
            value={`$${(monthlyRevenue / 1000).toFixed(1)}k`} 
            subValue="vs $15.2k Target" 
            trend={12.5} 
            icon={TrendingUp} 
            color="emerald" 
        />
        
        {/* Total Registered Users Widget */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Activity size={20} />
                </div>
                <div className="text-xs font-medium px-2 py-1 rounded-full bg-slate-800 text-slate-400">
                    Total
                </div>
            </div>
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Registered Users</h3>
            <div className="text-2xl font-bold text-white mb-4">{totalMembers}</div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                    <div className="text-emerald-500 font-bold">{activeMembers}</div>
                    <div className="text-slate-500">Active</div>
                </div>
                <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                    <div className="text-amber-500 font-bold">{frozenMembers}</div>
                    <div className="text-slate-500">Frozen</div>
                </div>
            </div>
        </div>

        <StatCard 
            title="New Signups" 
            value="12" 
            subValue="Past 7 Days" 
            trend={8.1} 
            icon={Users} 
            color="purple" 
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-white">Recent Activity</h3>
                <button className="text-slate-400 hover:text-white"><MoreHorizontal size={18} /></button>
            </div>
            <div className="p-0">
                {[1, 2, 3, 4, 5].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400">
                             {i % 2 === 0 ? <CreditCard size={18} /> : <Users size={18} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {i % 2 === 0 ? "Membership Payment Recieved" : "New Member Registration"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {i % 2 === 0 ? "Alice Freeman - yearly plan" : "Marcus Jones joined as Basic Tier"}
                            </p>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock size={12} />
                            {i * 15 + 2}m ago
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 bg-slate-950/30 border-t border-slate-800 text-center">
                <button className="text-xs text-emerald-500 hover:text-emerald-400 font-medium uppercase tracking-wider">View All Activity</button>
            </div>
          </div>

          {/* Quick Actions / System Status */}
          <div className="space-y-6">
             {/* Member Access Control (New Feature) */}
             <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                     <Fingerprint size={80} className="text-emerald-500" />
                 </div>
                 <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                     <ScanLine size={18} className="text-emerald-500" />
                     Access Control
                 </h3>
                 
                 <div className="flex items-center justify-between mb-4">
                     <div className="text-sm">
                         <div className="text-white font-medium">{currentUser.name}</div>
                         <div className="text-slate-500 text-xs">ID: {currentUser.id}</div>
                     </div>
                     <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                         ACTIVE
                     </span>
                 </div>

                 <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                     <div className="flex items-center justify-between">
                         <span className="text-sm text-slate-300">Biometric Entry</span>
                         <AccessToggle />
                     </div>
                     <p className="text-xs text-slate-500 mt-2">
                         Toggling this instantly updates the member's Digital Pass from QR to Bio-Auth.
                     </p>
                 </div>
             </div>

             {/* System Health */}
             <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <h3 className="font-bold text-white mb-4">System Health</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-sm text-slate-300">Smart Lockers</span>
                        </div>
                        <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Operational</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-sm text-slate-300">Access Control</span>
                        </div>
                        <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-sm text-slate-300">HVAC System</span>
                        </div>
                        <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">Maintenance</span>
                    </div>
                </div>
             </div>
             
             {/* Upcoming Classes Preview */}
             <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <h3 className="font-bold text-white mb-4">Shift Supervisor</h3>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-700 bg-[url('/demo-images/testimonial-2.jpg')] bg-cover"></div>
                    <div>
                        <div className="text-sm font-bold text-white">Sarah Chen</div>
                        <div className="text-xs text-slate-400">Floor Manager</div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">My Tasks</div>
                     {['Check morning inventory', 'Review trainer schedules', 'Approve maintenance request'].map((task, i) => (
                         <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                             <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/50" />
                             <span className={i === 0 ? "line-through text-slate-600" : ""}>{task}</span>
                         </div>
                     ))}
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}

function AccessToggle() {
  const { accessMethod, setAccessMethod } = useGymStore();
  
  const isBio = accessMethod === 'biometric';
  
  return (
    <button 
      onClick={() => setAccessMethod(isBio ? 'qr' : 'biometric')}
      className={cn(
          "w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
          isBio ? "bg-emerald-500" : "bg-slate-700"
      )}
    >
      <div className={cn(
          "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300",
          isBio ? "translate-x-6" : "translate-x-0"
      )} />
    </button>
  );
}
