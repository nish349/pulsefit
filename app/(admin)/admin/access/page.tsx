'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, Filter, Fingerprint, ScanLine, Clock, ArrowRight, X, Calendar, MapPin, Tag, Smartphone, AlertTriangle } from 'lucide-react';

const auditLogs = [
  { id: 'l1', user: 'Alex Johnson', type: 'Member', method: 'Biometric', status: 'Granted', location: 'Main Gate', time: '10:42 AM', date: 'Today' },
  { id: 'l2', user: 'Sarah Chen', type: 'Staff', method: 'Keycard', status: 'Granted', location: 'Staff Room', time: '10:15 AM', date: 'Today' },
  { id: 'l3', user: 'Unknown', type: 'Guest', method: 'QR', status: 'Denied', location: 'Main Gate', time: '09:55 AM', date: 'Today', reason: 'Invalid or Expired QR Code' },
  { id: 'l4', user: 'James Smith', type: 'Member', method: 'Biometric', status: 'Granted', location: 'Main Gate', time: '09:30 AM', date: 'Today' },
  { id: 'l5', user: 'Marcus Johnson', type: 'Admin', method: 'Biometric', status: 'Granted', location: 'Server Room', time: '08:00 AM', date: 'Today' },
  { id: 'l6', user: 'Robert Wilson', type: 'Member', method: 'QR', status: 'Granted', location: 'Main Gate', time: '07:45 AM', date: 'Today' },
  { id: 'l7', user: 'Emily White', type: 'Member', method: 'Keycard', status: 'Denied', location: 'Women\'s Locker', time: '07:15 AM', date: 'Today', reason: 'Access attempt outside of permitted hours' },
];

export default function AccessPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deniedOnly, setDeniedOnly] = useState(false);
  const [selectedLog, setSelectedLog] = useState<typeof auditLogs[0] | null>(null);

  const filteredLogs = deniedOnly ? auditLogs.filter(log => log.status === 'Denied') : auditLogs;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Access Log</h1>
          <p className="text-slate-400 text-sm flex items-center">
            Live audit trail of all entry events.
            <span className="ml-2 px-1.5 py-0.5 rounded flex items-center gap-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider animate-pulse border border-red-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Live
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search logs..."
              className="bg-slate-900 border border-slate-800 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-neon/50 focus:border-neon/50 outline-none w-64"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "p-2 border rounded-lg transition-colors",
              isFilterOpen || deniedOnly ? "bg-neon/10 border-neon/30 text-neon" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
            )}
          >
            <Filter size={18} />
          </button>

          {/* Filter Popover */}
          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-white font-bold text-sm">Filter Logs</h3>
                <button onClick={() => setIsFilterOpen(false)} className="text-slate-500 hover:text-white"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Date Range</label>
                  <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 text-sm text-slate-300">
                    <Calendar size={14} className="text-slate-500" />
                    <span>Today</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Method</label>
                    <select className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-lg p-2 outline-none focus:border-neon/50">
                      <option>All Methods</option>
                      <option>Biometric</option>
                      <option>Keycard</option>
                      <option>QR Code</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Location</label>
                    <select className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-lg p-2 outline-none focus:border-neon/50">
                      <option>All Locations</option>
                      <option>Main Gate</option>
                      <option>Staff Room</option>
                      <option>Server Room</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-3 p-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={deniedOnly}
                      onChange={(e) => setDeniedOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 text-red-500 focus:ring-red-500/50"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-red-500">Denied Only</div>
                      <div className="text-xs text-red-400/70">Show only failed entry attempts</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
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
            {filteredLogs.map((log) => (
              <tr
                key={log.id}
                onClick={() => log.status === 'Denied' ? setSelectedLog(log) : null}
                className={cn(
                  "transition-colors",
                  log.status === 'Denied' ? "cursor-pointer hover:bg-slate-800/50" : "hover:bg-slate-800/30"
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-1.5 h-1.5 rounded-full", log.status === 'Denied' ? "bg-red-500" : "bg-transparent")} />
                    <div className="text-slate-400 font-mono text-xs flex items-center gap-2">
                      <Clock size={14} />
                      {log.time}
                    </div>
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
                  <div className="flex items-center justify-end gap-2">
                    {log.status === 'Denied' && <span className="text-xs text-red-400 underline decoration-red-500/30 underline-offset-2">View Reason</span>}
                    <span className={cn("text-xs font-bold px-2 py-1 rounded inline-flex items-center gap-1",
                      log.status === 'Granted' ? "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20" : "text-red-500 bg-red-500/10 border border-red-500/20"
                    )}>
                      {log.status === 'Granted' ? "GRANTED" : "DENIED"}
                      {log.status === 'Granted' && <ArrowRight size={10} />}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Denial Reason Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-500 font-bold">
                <AlertTriangle size={18} />
                <h3>Access Denied Details</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4">
                <label className="text-xs text-red-500/70 font-bold uppercase block mb-1">Denial Reason</label>
                <div className="text-red-400 font-medium">
                  {selectedLog.reason || "Unknown Security Exception"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3">
                  <label className="text-xs text-slate-500 block mb-1">User</label>
                  <div className="text-white font-medium text-sm">{selectedLog.user} ({selectedLog.type})</div>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3">
                  <label className="text-xs text-slate-500 block mb-1">Time & Location</label>
                  <div className="text-white font-medium text-sm">{selectedLog.time} at {selectedLog.location}</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
