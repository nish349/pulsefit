'use client';

import { Activity, Facebook, Instagram, Twitter, Linkedin, Youtube, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="px-4 pb-8 pt-10 bg-slate-950">
      <div className="container mx-auto max-w-7xl">
        {/* Main White Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row justify-between relative overflow-hidden">
           
           {/* Left Content */}
           <div className="max-w-2xl relative z-10">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-8 h-8 rounded-full bg-neon flex items-center justify-center text-slate-950">
                    <Activity size={18} strokeWidth={3} />
                 </div>
                 <span className="text-xl font-bold text-slate-900 tracking-tighter">
                   PulseFit
                 </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tighter mb-6 leading-[0.95]">
                 Every athlete needs feedback. Great ones use it.
              </h2>
              
              <p className="text-slate-500 font-medium max-w-lg">
                 Emphasizes the value of actionable insights for peak performance.
              </p>
           </div>

           {/* Right Content - Links & Socials */}
           <div className="flex flex-col justify-between items-end mt-12 md:mt-0 relative z-10 gap-12">
               {/* Navigation Links */}
               <div className="grid grid-cols-2 gap-x-16 gap-y-4 text-slate-900 font-semibold text-right">
                  <Link href="#" className="hover:text-neon-hover transition-colors">Testimonial</Link>
                  <Link href="#" className="hover:text-neon-hover transition-colors">Style Guide</Link>
                  <Link href="/pricing" className="hover:text-neon-hover transition-colors">Pricing</Link>
                  <Link href="#" className="hover:text-neon-hover transition-colors">Changelog</Link>
                  <Link href="#" className="hover:text-neon-hover transition-colors">How it works?</Link>
                  <Link href="#" className="hover:text-neon-hover transition-colors">Licencing</Link>
               </div>

               {/* Social Icons */}
               <div className="flex gap-4">
                  {[Facebook, Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                     <a href="#" key={i} className="w-10 h-10 rounded-full bg-neon flex items-center justify-center text-slate-950 hover:bg-neon-hover transition-colors hover:scale-110">
                        <Icon size={20} />
                     </a>
                  ))}
               </div>
           </div>
        </div>

        {/* Bottom Copyright */}
         <div className="mt-8 px-4 text-slate-400 text-sm font-medium flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
               © 2026 PulseFit. All rights reserved.
            </div>
            <div>
               Designed & Developed by <a href="https://nish349.github.io/nish.dev/" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-neon transition-colors">S.Nish Studios</a>
            </div>
         </div>
      </div>
    </footer>
  );
}
