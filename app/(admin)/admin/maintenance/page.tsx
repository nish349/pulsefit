'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Activity, Wrench, CheckCircle, AlertTriangle, XCircle, Plus, Edit2, Save, X, Trash2 } from 'lucide-react';
import { useGymStore } from '@/lib/store';

interface System {
  id: string;
  name: string;
  status: string;
  reportedAt?: string;
  [key: string]: any;
}

export default function MaintenancePage() {
    // Determine hydration
    const [isMounted, setIsMounted] = useState(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setIsMounted(true), []);

    const { systems, setSystems, updateSystem } = useGymStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    if (!isMounted) return null;

    // Handlers
    const updateStatus = (id: string, status: string) => {
        const sys = systems.find(s => s.id === id);
        if (sys) updateSystem({ ...sys, status });
    };

    const attemptReport = () => {
        const newSystem = {
            id: `s${Date.now()}`,
            name: 'New Issue (Click to Edit)',
            status: 'Operational',
            reportedAt: new Date().toISOString()
        };
        setSystems([newSystem, ...systems]);
        // Auto-start edit for convenience
        setEditingId(newSystem.id);
        setEditName(newSystem.name);
    };

    const startEdit = (sys: System) => {
        setEditingId(sys.id);
        setEditName(sys.name);
    };

    const saveEdit = () => {
        if (!editingId) return;
        const sys = systems.find(s => s.id === editingId);
        if (sys) {
            updateSystem({ ...sys, name: editName });
        }
        setEditingId(null);
        setEditName('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
    };

    const deleteSystem = (id: string) => {
        if (confirm('Are you sure you want to remove this system log?')) {
            setSystems(systems.filter(s => s.id !== id));
        }
    }

    const formatDate = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        if (status === 'Operational') return <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"><CheckCircle size={12} /> OPERATIONAL</div>;
        if (status === 'Maintenance') return <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20"><Wrench size={12} /> MAINTENANCE</div>;
        return <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20"><XCircle size={12} /> OFFLINE</div>;
    };

    return (
        <div className="space-y-6 pb-20">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">System Health</h1>
                    <p className="text-slate-400 text-sm">Monitor and update facility infrastructure status.</p>
                </div>
                <button 
                    onClick={attemptReport}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
                >
                    <Plus size={18} />
                    Report New Issue
                </button>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950/50 text-slate-400 uppercase font-medium text-xs">
                        <tr>
                            <th className="px-6 py-4">System Name</th>
                            <th className="px-6 py-4">Current Status</th>
                            <th className="px-6 py-4">Reported At</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {systems.map((sys) => {
                            const isEditing = editingId === sys.id;
                            return (
                                <tr key={sys.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-2 h-2 rounded-full flex-shrink-0", 
                                                sys.status === 'Operational' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
                                                sys.status === 'Maintenance' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : 
                                                "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                            )} />
                                            
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm focus:border-[#00FFCC] outline-none"
                                                        autoFocus
                                                    />
                                                    <button onClick={saveEdit} className="text-[#00FFCC] hover:bg-[#00FFCC]/10 p-1 rounded"><Save size={14} /></button>
                                                    <button onClick={cancelEdit} className="text-red-500 hover:bg-red-500/10 p-1 rounded"><X size={14} /></button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span>{sys.name}</span>
                                                    <button 
                                                        onClick={() => startEdit(sys)} 
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-[#00FFCC] p-1"
                                                    >
                                                        <Edit2 size={12} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={sys.status} />
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                        {sys.reportedAt ? formatDate(sys.reportedAt) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 inline-flex">
                                            <button 
                                                onClick={() => updateStatus(sys.id, 'Operational')}
                                                className={cn("p-1.5 rounded transition-colors", sys.status === 'Operational' ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-500 hover:text-emerald-500")}
                                                title="Set Operational"
                                            >
                                                <CheckCircle size={14} />
                                            </button>
                                            <button 
                                                onClick={() => updateStatus(sys.id, 'Maintenance')}
                                                className={cn("p-1.5 rounded transition-colors", sys.status === 'Maintenance' ? "bg-amber-500 text-slate-950 shadow" : "text-slate-500 hover:text-amber-500")}
                                                title="Set Maintenance"
                                            >
                                                <Wrench size={14} />
                                            </button>
                                            <button 
                                                onClick={() => updateStatus(sys.id, 'Not Working')}
                                                className={cn("p-1.5 rounded transition-colors", sys.status === 'Not Working' ? "bg-red-500 text-white shadow" : "text-slate-500 hover:text-red-500")}
                                                title="Set Not Working"
                                            >
                                                <AlertTriangle size={14} />
                                            </button>
                                            <div className="w-[1px] h-4 bg-slate-800 mx-1" />
                                            <button 
                                                onClick={() => deleteSystem(sys.id)}
                                                className="p-1.5 rounded text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                                title="Delete Log"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
