"use client";

import { useState } from "react";
import { ScanLine, X, Camera } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function CheckInScanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 p-6 rounded-2xl flex items-center justify-between group transition-all shadow-lg shadow-emerald-500/20"
      >
        <div className="flex flex-col items-start gap-1">
          <span className="text-2xl font-black uppercase tracking-tight">Scan to Check-In</span>
          <span className="text-sm font-medium opacity-80">Tap to open scanner</span>
        </div>
        <div className="bg-slate-950/20 p-4 rounded-xl group-hover:scale-110 transition-transform">
          <ScanLine size={32} strokeWidth={2.5} />
        </div>
      </button>

      {/* Visual Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            {/* Dialog Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden relative"
            >
              {/* Header */}
              <div className="p-6 pb-2 flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">Scan QR Code</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Camera Viewfinder Mock */}
              <div className="p-6 pt-2">
                <div className="aspect-square bg-black rounded-2xl border-2 border-slate-800 relative overflow-hidden flex items-center justify-center">
                  {/* Scanning Animation */}
                  <motion.div
                    animate={{ top: ["10%", "90%", "10%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-[10%] right-[10%] h-0.5 bg-neon shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10"
                  />

                  {/* Corner Makers */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/50 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/50 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/50 rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/50 rounded-br-lg" />

                  <div className="text-slate-600 flex flex-col items-center gap-2">
                    <Camera size={32} />
                    <span className="text-xs uppercase tracking-widest">Camera Inactive</span>
                  </div>
                </div>
                <p className="text-center text-slate-500 text-sm mt-4">
                  Align the QR code within the frame to check in.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
