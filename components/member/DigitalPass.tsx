'use client';

import React from 'react';
import QRCode from 'react-qr-code';
import { Fingerprint, ScanLine } from 'lucide-react';
import { useGymStore } from '@/lib/store';
import { currentUser } from '@/lib/demo-data';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

export default function DigitalPass() {
  const { accessMethod } = useGymStore();

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-3xl overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-2xl group">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10 opacity-50" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      
      {/* Card Content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full p-8 text-center">
        
        {/* Header */}
        <div className="w-full flex justify-between items-center opacity-80">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                    <Activity size={14} strokeWidth={3} />
                </div>
                <span className="font-bold text-white tracking-tight">PulseFit</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded">
                ACCESS PASS
            </div>
        </div>

        {/* Dynamic Entry Display */}
        <div className="flex-1 flex flex-col items-center justify-center w-full my-6">
           <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
               {accessMethod === 'qr' || accessMethod === 'both' ? (
                   <div className="bg-white p-4 rounded-xl relative">
                       <QRCode 
                           value={`user:${currentUser.id}`} 
                           size={180}
                           viewBox={`0 0 256 256`}
                           style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                       />
                       {/* Biometric Badge Overlay for BOTH mode */}
                       {accessMethod === 'both' && (
                           <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-slate-950 p-2 rounded-full border-4 border-slate-900 shadow-xl" title="Biometric Entry Also Active">
                               <Fingerprint size={20} />
                           </div>
                       )}
                   </div>
               ) : (
                   <div className="w-48 h-48 flex items-center justify-center relative">
                       <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-20" />
                       <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-pulse" />
                       <Fingerprint size={100} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
                   </div>
               )}
               
               {/* Scanner Line Animation */}
               <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                   <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute top-0 animate-[scan_3s_ease-in-out_infinite] opacity-50" />
               </div>
           </div>

           <p className="mt-6 text-sm font-medium text-slate-300 animate-pulse flex items-center gap-2">
               {accessMethod === 'qr' ? 'Scan at Turnstile' : 
                accessMethod === 'biometric' ? 'Bio-Auth Ready' : 
                <>
                    Scan QR <span className="text-slate-500">•</span> Bio-Auth Ready
                </>}
           </p>
        </div>

        {/* Footer */}
        <div className="w-full pt-6 border-t border-white/10">
            <h3 className="text-xl font-bold text-white">{currentUser.name}</h3>
            <p className="text-emerald-400 text-sm font-medium uppercase tracking-widest mt-1">{currentUser.tier} Member</p>
        </div>
      </div>
    </div>
  );
}
