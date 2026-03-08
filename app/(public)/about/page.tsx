'use client';

import FadeIn from '@/components/ui/FadeIn';
import Counter from '@/components/ui/Counter';
import FAQSection from '@/components/sections/FAQSection';
import TeamCard from '@/components/ui/TeamCard';
import { team } from '@/lib/demo-data';
import { Activity, Zap, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const stats = [
   { label: 'Facility Size', value: 12000, suffix: '+', sub: 'Square Feet' },
   { label: 'Cardio Stations', value: 42, sub: 'Elite Equipment' },
   { label: 'Active Members', value: 850, suffix: '+', sub: 'Community' },
   { label: 'Goal Success', value: 98, suffix: '%', sub: 'Verified Results' },
];

const values = [
   {
      icon: Activity,
      title: 'Data-Driven',
      desc: "We don't guess. We scan. Every workout is backed by biometric data."
   },
   {
      icon: Zap,
      title: 'Recovery-First',
      desc: "Muscles grow during rest, not reps. Our recovery suite is world-class."
   },
   {
      icon: Users,
      title: 'Community-Led',
      desc: "Competition breeds performance. Train with the best to become the best."
   },
   {
      icon: Shield,
      title: 'Tech-Integrated',
      desc: "Your progress, visualized daily. AI insights for continuous improvement."
   },
];

export default function AboutPage() {
   return (
      <div className="bg-slate-950 min-h-screen text-slate-100 overflow-x-hidden">

         {/* Section A: The Manifesto (Hero) */}
         <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 text-center">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vh] h-[50vh] bg-neon/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <FadeIn delay={0.2} className="max-w-5xl mx-auto">
               <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9] text-white">
                  Built for <br />
                  <span className="text-slate-500">Athletic Dominance.</span>
               </h1>
            </FadeIn>

            <FadeIn delay={0.4} className="max-w-2xl mx-auto">
               <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
                  PulseFit combines elite biometric data with Olympic-level recovery infrastructure. This isn&apos;t just a gym; it&apos;s a high-performance laboratory for your body.
               </p>
            </FadeIn>
         </section>


         {/* Section B: The Live Stats Bar */}
         <section className="py-24 border-y border-white/5 bg-slate-900/20 backdrop-blur-sm">
            <div className="container mx-auto max-w-7xl px-4">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
                  {stats.map((stat, i) => (
                     <FadeIn key={i} delay={i * 0.1} className="text-center">
                        <div className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight">
                           <Counter value={stat.value} suffix={stat.suffix} />
                        </div>
                        <div className="text-neon font-bold text-sm uppercase tracking-wider mb-1">
                           {stat.label}
                        </div>
                        <div className="text-slate-500 text-sm">
                           {stat.sub}
                        </div>
                     </FadeIn>
                  ))}
               </div>
            </div>
         </section>


         {/* Section C: The Core Values (The Grid) */}
         <section className="py-32 px-4 relative">
            <div className="container mx-auto max-w-7xl">
               <FadeIn>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-20 text-center">
                     The Code We Live By
                  </h2>
               </FadeIn>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {values.map((item, i) => (
                     <FadeIn key={i} delay={i * 0.1} className="h-full">
                        <div className="h-full p-10 md:p-14 rounded-[2.5rem] bg-slate-900 border border-white/5 hover:border-neon/30 transition-all duration-500 group relative overflow-hidden">

                           {/* Hover Gradient */}
                           <div className="absolute inset-0 bg-gradient-to-br from-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                           <div className="relative z-10 flex flex-col h-full gap-6">
                              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-neon group-hover:scale-110 transition-transform duration-500 group-hover:bg-neon group-hover:text-slate-950">
                                 <item.icon size={28} strokeWidth={2} />
                              </div>

                              <div>
                                 <h3 className="text-3xl font-bold text-white mb-4 tracking-tight group-hover:text-neon transition-colors">
                                    {item.title}
                                 </h3>
                                 <p className="text-lg text-slate-400 leading-relaxed font-medium">
                                    {item.desc}
                                 </p>
                              </div>
                           </div>
                        </div>
                     </FadeIn>
                  ))}
               </div>
            </div>
         </section>

         {/* Meet the Team */}
         <section className="py-24 px-4 relative border-t border-white/5">
            <div className="container mx-auto max-w-7xl text-center">
               <FadeIn>
                  <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-16">
                     The Squad
                  </h2>
               </FadeIn>
               <div className="space-y-8">
                  {team.map((member, i) => (
                     <FadeIn key={member.id} delay={i * 0.1}>
                        <TeamCard member={member} />
                     </FadeIn>
                  ))}
               </div>
            </div>
         </section>

         {/* Section D: FAQ (Accordion) */}
         <FAQSection />

      </div>
   );
}


