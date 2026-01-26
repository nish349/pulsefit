'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Activity, Menu, X } from 'lucide-react';
import CrowdMeter from '@/components/layout/CrowdMeter';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/facility', label: 'Facility' },
    { href: '/about', label: 'About' },
    { href: '/#contact', label: 'Contact Us' },
  ];

  return (
    <>
      <nav className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[95%] md:max-w-4xl px-2 md:px-4">
        <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-xl border border-white/10 px-4 md:px-6 py-3 rounded-full shadow-2xl ring-1 ring-white/5">
          {/* Logo */}
          <Link href="/#hero" className="flex items-center gap-2 group z-50 relative" onClick={() => setIsMenuOpen(false)}>
            <div className="w-8 h-8 rounded-full bg-neon flex items-center justify-center text-slate-950">
               <Activity size={18} strokeWidth={3} />
            </div>
            <span className="text-lg font-bold italic tracking-tighter text-white">
              Pulse<span className="text-neon transition-colors group-hover:text-white">Fit</span>
            </span>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="hover:text-neon transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
             <CrowdMeter />
             <div className="h-4 w-px bg-white/10" />
             <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
               Login
             </Link>
             <Link href="/pricing" className="bg-neon text-slate-950 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-neon-hover transition-colors shadow-[0_0_20px_rgba(190,242,100,0.3)] hover:shadow-[0_0_30px_rgba(190,242,100,0.5)]">
               Join Now
             </Link>
          </div>

          {/* Mobile Actions & Toggle */}
          <div className="flex items-center gap-3 md:hidden">
             <div className="scale-90 origin-right">
                <CrowdMeter />
             </div>
             <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white z-50 relative active:scale-95 transition-transform"
             >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:hidden shadow-2xl overflow-hidden"
          >
             <div className="flex flex-col gap-4">
                {navLinks.map(link => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold text-slate-300 hover:text-white py-2 border-b border-white/5 last:border-0"
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="h-px bg-white/10 my-2" />
                
                <Link 
                  href="/login"
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-center py-3 text-slate-300 hover:text-white font-bold bg-slate-800 rounded-xl"
                >
                  Member Login
                </Link>
                <Link 
                  href="/pricing"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center py-3 bg-neon text-slate-950 font-black rounded-xl hover:bg-neon-hover shadow-lg shadow-neon/20"
                >
                  Join Now
                </Link>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
