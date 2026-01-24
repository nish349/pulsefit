'use client';

import Link from 'next/link';
import { useGymStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

export default function Navbar() {
  const { crowdCount, occupancyStatus } = useGymStore();

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl ring-1 ring-white/5">
        {/* Logo */}
        <Link href="/#hero" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-neon flex items-center justify-center text-slate-950">
             <Activity size={18} strokeWidth={3} />
          </div>
          <span className="text-lg font-bold italic tracking-tighter text-white">
            Pulse<span className="text-neon transition-colors group-hover:text-white">Fit</span>
          </span>
        </Link>
        
        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="/facility" className="hover:text-neon transition-colors">Facility</Link>
          <Link href="/about" className="hover:text-neon transition-colors">About</Link>
          <Link href="/#contact" className="hover:text-neon transition-colors">Contact Us</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
           {/* Crowd Meter Badge */}
           <div className="hidden sm:flex items-center gap-2 pl-3 pr-4 py-1.5 bg-slate-950/50 rounded-full text-xs font-semibold border border-white/10">
              <span className={cn("w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px]", 
                  occupancyStatus === 'Low' ? 'bg-green-500 shadow-green-500/50' : 
                  occupancyStatus === 'Medium' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-red-500 shadow-red-500/50'
              )} />
              <span className="text-slate-200 whitespace-nowrap">{crowdCount} Live</span>
           </div>

           <div className="h-4 w-px bg-white/10 hidden sm:block" />

           <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition-colors">
             Login
           </Link>

           <Link href="/pricing" className="bg-neon text-slate-950 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-neon-hover transition-colors shadow-[0_0_20px_rgba(190,242,100,0.3)] hover:shadow-[0_0_30px_rgba(190,242,100,0.5)]">
             Join Now
           </Link>
        </div>
      </div>
    </nav>
  )
}
