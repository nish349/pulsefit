'use client';

import { pricingPlans } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 bg-slate-950 border-t border-white/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-neon/5 blur-[100px] -z-10 rounded-full" />

      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Pricing Plan
          </h2>
          <p className="text-slate-400">
            Free 2-day trial, no credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col p-8 rounded-3xl border transition-all duration-300",
                plan.highlight 
                  ? "bg-slate-900 border-neon/50 shadow-[0_0_40px_rgba(190,242,100,0.1)] scale-105 z-10" 
                  : "bg-slate-900/50 border-white/10 hover:border-white/20"
              )}
            >
              {plan.highlight && (
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                 </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                   <span className="text-4xl md:text-5xl font-black text-white tracking-tight">{plan.price}</span>
                   <span className="text-slate-400">/mo</span>
                </div>
                <p className="text-slate-500 text-sm mt-2">or ₹{parseInt(plan.price.replace('₹', '')) * 10 + 9} yearly</p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                 {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                       <div className={cn("flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center", plan.highlight ? "bg-neon text-slate-950" : "bg-white/10 text-slate-400")}>
                          <Check size={12} strokeWidth={4} />
                       </div>
                       <span className="text-slate-300 text-sm font-medium">{feature}</span>
                    </div>
                 ))}
              </div>

              <Link 
                href={`/register?plan=${plan.id}`}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-center transition-all",
                  plan.highlight 
                    ? "bg-neon text-slate-950 hover:bg-neon-hover shadow-lg shadow-neon/20" 
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/5"
                )}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
