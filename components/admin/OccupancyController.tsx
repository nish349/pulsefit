'use client';

import React from 'react';
import { useGymStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Users, AlertCircle, Info } from 'lucide-react';

export default function OccupancyController() {
    const { occupancy, currentInside, maxCapacity, setCurrentInside } = useGymStore();
    const [showRecalibrate, setShowRecalibrate] = React.useState(false);

    let status = 'Low';
    let color = 'bg-emerald-500'; // Default low active
    let textColor = 'text-emerald-500';
    let badgeBg = 'bg-emerald-500/10';

    // Status logic based on occupancy %
    if (occupancy >= 85) {
        status = 'Peak';
        color = 'bg-amber-500'; // Warning/Peak
        textColor = 'text-amber-500';
        badgeBg = 'bg-amber-500/10';
    } else if (occupancy >= 50) {
        status = 'Nominal';
        color = 'bg-emerald-500'; // Nominal is also good/active
        textColor = 'text-emerald-500'; // Keep cyan/green for nominal
        badgeBg = 'bg-emerald-500/10';
    }

    // Handle Flush
    const handleFlush = () => {
        // Mock logic: reduce count by 5 (simulate removing ghosts)
        const newCount = Math.max(0, currentInside - 5);
        setCurrentInside(newCount);
        setShowRecalibrate(false);
    };

    return (
        <>
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group relative overflow-hidden shadow-2xl">
                {/* Decorative Background */}
                <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-30 -mr-10 -mt-10 pointer-events-none", color)} />

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="p-3 rounded-xl bg-slate-800/50 text-slate-300 border border-white/5 shadow-inner">
                        <Users size={22} />
                    </div>
                    <div className={cn("flex items-center text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-black/20 border border-white/5 backdrop-blur-sm",
                        badgeBg, textColor
                    )}>
                        {status} Traffic
                    </div>
                </div>

                <div className="flex items-center justify-between relative z-10 mb-2">
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Live Occupancy</h3>
                    {/* Live Sync Pulse Heartbeat */}
                    <div className="flex items-center gap-2 bg-slate-950/30 px-2 py-1 rounded-full border border-white/5" title="Live Sync Active">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Live</span>
                    </div>
                </div>

                <div className="text-4xl font-black text-white mb-6 relative z-10 flex items-baseline gap-2">
                    {currentInside} <span className="text-slate-500 font-medium text-lg">/ {maxCapacity}</span>
                </div>

                {/* Control Deck */}
                <div className="relative z-10">
                    <button
                        onClick={() => setShowRecalibrate(true)}
                        className="w-full py-3 px-4 text-xs font-bold text-slate-300 bg-slate-800/50 hover:bg-slate-800 hover:text-white active:bg-slate-900 rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-center gap-2 group/btn"
                    >
                        <AlertCircle size={14} className="text-amber-500 group-hover/btn:scale-110 transition-transform" />
                        Recalibrate Sensors
                    </button>
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium">
                        <Info size={10} className="text-slate-500" />
                        <span>Auto-sync via Hardware Feed</span>
                    </div>
                </div>
            </div>

            {/* Recalibrate Modal */}
            {showRecalibrate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
                        <button
                            onClick={() => setShowRecalibrate(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white"
                        >
                            ✕
                        </button>

                        <h3 className="text-lg font-bold text-white mb-2">Recalibrate Occupancy</h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Detected {currentInside} active sessions. If the count drifts from reality (e.g. members forgot to scan out), you can flush stale sessions.
                        </p>

                        <div className="bg-amber-950/30 border border-amber-900/50 p-3 rounded-lg flex items-start gap-3 mb-6">
                            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                            <div className="text-xs text-amber-200/80">
                                <strong className="block text-amber-500 mb-1">Calibration Action</strong>
                                This will force-close sessions inactive for {'>'} 3 hours. Estimated correction: -5 users.
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRecalibrate(false)}
                                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFlush}
                                className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/20 transition-all"
                            >
                                Flush Stale Sessions
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
