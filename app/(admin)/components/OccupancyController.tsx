'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { useGymStore } from '@/lib/store';

export default function OccupancyController() {
  const { occupancy, setOccupancy } = useGymStore();

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={100} className="text-emerald-500" />
        </div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    Live Occupancy Controller
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </h3>
                <p className="text-slate-400 text-sm">Updates the public "Crowd Meter" in real-time.</p>
            </div>
            <div className="text-right">
                <div className="text-3xl font-mono font-bold text-emerald-400">{occupancy}%</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Capacity</div>
            </div>
        </div>

        <div className="mb-8">
          <input
            type="range"
            min="0"
            max="100"
            value={occupancy}
            onChange={(e) => setOccupancy(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-slate-900 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
            <span>0% (Empty)</span>
            <span>50% (Moderate)</span>
            <span>100% (Full)</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                <div className="text-slate-400 mb-1">Checked In</div>
                <div className="text-white font-bold">42</div>
            </div>
            <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                <div className="text-slate-400 mb-1">Staff</div>
                <div className="text-white font-bold">8</div>
            </div>
            <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                <div className="text-slate-400 mb-1">Capacity</div>
                <div className="text-white font-bold">120</div>
            </div>
        </div>
      </div>
    </div>
  );
}
