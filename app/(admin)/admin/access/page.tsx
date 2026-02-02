'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Search, Filter, Fingerprint, ScanLine, Clock, ArrowRight } from 'lucide-react';

const auditLogs = [
  { id: 'l1', user: 'Alex Johnson', type: 'Member', method: 'Biometric', status: 'Granted', location: 'Main Gate', time: '10:42 AM', date: 'Today' },
  { id: 'l2', user: 'Sarah Chen', type: 'Staff', method: 'Keycard', status: 'Granted', location: 'Staff Room', time: '10:15 AM', date: 'Today' },
  { id: 'l3', user: 'Unknown', type: 'Guest', method: 'QR', status: 'Denied', location: 'Main Gate', time: '09:55 AM', date: 'Today' },
  { id: 'l4', user: 'James Smith', type: 'Member', method: 'Biometric', status: 'Granted', location: 'Main Gate', time: '09:30 AM', date: 'Today' },
  { id: 'l5', user: 'Marcus Johnson', type: 'Admin', method: 'Biometric', status: 'Granted', location: 'Server Room', time: '08:00 AM', date: 'Today' },
  { id: 'l6', user: 'Robert Wilson', type: 'Member', method: 'QR', status: 'Granted', location: 'Main Gate', time: '07:45 AM', date: 'Today' },
];

export default function AccessPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Access Log</h1>
          <p className="text-slate-400 text-sm">Live audit trail of all entry events.</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Search logs..." 
                    className="bg-slate-900 border border-slate-800 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-neon/50 focus:border-neon/50 outline-none w-64"
                />
             </div>
             <button className="p-2 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-lg">
                <Filter size={18} />
             </button>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/50 text-slate-400 uppercase font-medium text-xs">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                    <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {log.time}
                    </div>
                </td>
                <td className="px-6 py-4 font-medium text-white">{log.user}</td>
                <td className="px-6 py-4">
                    <span className={cn("text-xs px-2 py-0.5 rounded border",
                        log.type === 'Admin' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                        log.type === 'Staff' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        "bg-slate-800 text-slate-400 border-slate-700"
                    )}>
                        {log.type}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-300 text-xs">
                        {log.method === 'Biometric' ? <Fingerprint size={14} className="text-emerald-500" /> : <ScanLine size={14} className="text-blue-500" />}
                        {log.method}
                    </div>
                </td>
                <td className="px-6 py-4 text-slate-400">{log.location}</td>
                <td className="px-6 py-4 text-right">
                    <span className={cn("text-xs font-bold px-2 py-1 rounded inline-flex items-center gap-1",
                        log.status === 'Granted' ? "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20" : "text-red-500 bg-red-500/10 border border-red-500/20"
                    )}>
                        {log.status === 'Granted' ? "GRANTED" : "DENIED"}
                        {log.status === 'Granted' && <ArrowRight size={10} />}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
