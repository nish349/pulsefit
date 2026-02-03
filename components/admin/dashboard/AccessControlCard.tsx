"use client";

import React from 'react';
import { Fingerprint, ScanLine, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGymStore } from '@/lib/store';
import { members, currentUser } from '@/lib/demo-data';

export default function AccessControlCard() {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl group h-full">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
        <Fingerprint size={120} className="text-white" />
      </div>
      <h3 className="font-bold text-white mb-6 flex items-center gap-3 text-lg">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
          <ScanLine size={20} />
        </div>
        Access Control
      </h3>

      <div className="flex items-center justify-between mb-6 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
        <div>
          <div className="text-white font-bold">{currentUser.name}</div>
          <div className="text-slate-500 text-xs font-mono mt-0.5">ID: <span className="text-slate-300">{currentUser.id}</span></div>
        </div>
        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 uppercase tracking-wider animate-pulse">
          ACTIVE
        </span>
      </div>

      <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-300">Biometric Entry</span>
          <AccessToggle />
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
          Toggling this instantly updates the member&apos;s Digital Pass from QR to Bio-Auth.
        </p>
      </div>
    </div>
  );
}

function AccessToggle() {
  const { accessMethod, setAccessMethod } = useGymStore();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [pendingMethod, setPendingMethod] = React.useState<'qr' | 'biometric' | 'both' | null>(null);

  const handleRequestChange = (method: 'qr' | 'biometric' | 'both') => {
    if (method === accessMethod) return; // No change needed
    setPendingMethod(method);
    setShowConfirm(true);
  };

  const confirmChange = () => {
    if (pendingMethod) {
      setAccessMethod(pendingMethod);
    }
    setShowConfirm(false);
    setPendingMethod(null);
  };

  return (
    <>
      <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
        <button
          onClick={() => handleRequestChange('qr')}
          className={cn(
            "px-3 py-1 text-xs font-bold rounded-md transition-all",
            accessMethod === 'qr' ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"
          )}
        >
          QR
        </button>
        <button
          onClick={() => handleRequestChange('biometric')}
          className={cn(
            "px-3 py-1 text-xs font-bold rounded-md transition-all",
            accessMethod === 'biometric' ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"
          )}
        >
          Bio
        </button>
        <button
          onClick={() => handleRequestChange('both')}
          className={cn(
            "px-3 py-1 text-xs font-bold rounded-md transition-all",
            accessMethod === 'both' ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"
          )}
        >
          Both
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white mb-2">Confirm Access Switch</h3>
            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to switch the global access method to <strong className="text-white uppercase">{pendingMethod}</strong>?
            </p>

            <div className="bg-amber-950/30 border border-amber-900/50 p-3 rounded-lg flex items-start gap-3 mb-6">
              <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
              <div className="text-xs text-amber-200/80">
                <strong className="block text-amber-500 mb-1">Impact Warning</strong>
                This will immediately update the Digital Pass for all {members.length} active members.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmChange}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all"
              >
                Confirm Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
