'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Parallax and Scale effects
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const scaleCenter = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const scaleSide = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacitySide = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section id="hero" ref={containerRef} className="relative h-[125vh] bg-slate-950 overflow-hidden">
       {/* Sticky Container */}
       <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
          
          {/* Background Grid */}
          <div className="absolute inset-0 grid grid-cols-3 gap-4 px-4 h-screen z-0">
             {/* Left Column */}
             <motion.div style={{ scale: scaleSide, opacity: opacitySide }} className="relative h-full rounded-3xl overflow-hidden hidden md:block">
                <Image 
                  src="/demo-images/hero-left.jpg"
                  alt="Gym Left"
                  fill
                  className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-slate-950/20" />
             </motion.div>

             {/* Center Column (Main) */}
             <motion.div style={{ scale: scaleCenter }} className="relative h-full col-span-3 md:col-span-1 rounded-3xl overflow-hidden shadow-2xl shadow-neon/10">
                <Image 
                  src="/demo-images/hero-center.jpg"
                  alt="Gym Center"
                  fill
                  className="object-cover opacity-60"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
             </motion.div>

             {/* Right Column */}
             <motion.div style={{ scale: scaleSide, opacity: opacitySide }} className="relative h-full rounded-3xl overflow-hidden hidden md:block">
                <Image 
                  src="/demo-images/hero-right.jpg"
                  alt="Gym Right"
                  fill
                  className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-slate-950/20" />
             </motion.div>
          </div>

          {/* Text Content (Overlaid) */}
          <motion.div style={{ opacity: opacityContent, y }} className="relative z-10 text-center max-w-5xl space-y-8 px-4 mt-20">
             
             <h1 className="text-5xl md:text-9xl font-black tracking-tighter text-white leading-[0.9] drop-shadow-2xl">
               Unlock Your <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">True Potential</span>
             </h1>
             
             <p className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
               Revolutionary personality assessment platform that helps coaches tailor their approach to each athlete's unique psychological profile for maximum performance gains.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link href="/pricing" className="bg-neon text-slate-950 font-bold px-8 py-4 rounded-full text-lg hover:bg-neon-hover transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(190,242,100,0.3)] hover:shadow-[0_0_50px_rgba(190,242,100,0.5)] flex items-center gap-2">
                  Get Membership <ChevronRight size={20} />
                </Link>
                <Link href="/login" className="bg-black/40 text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-black/60 transition-all border border-white/10 backdrop-blur-sm">
                  Login
                </Link>
             </div>
          </motion.div>
       </div>
    </section>
  )
}
