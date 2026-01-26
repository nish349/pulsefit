import { pricingPlans } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="container mx-auto py-20 px-4">
      <div className="text-center mb-16">
         <h1 className="text-5xl font-black italic tracking-tighter text-white mb-4">Pricing Plans</h1>
         <p className="text-slate-400">Choose the perfect plan for your journey.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
         {pricingPlans.map(plan => (
           <div key={plan.id} className={cn(
             "relative p-8 rounded-3xl border flex flex-col",
             plan.highlight 
               ? "bg-slate-900 border-neon shadow-[0_0_50px_rgba(190,242,100,0.1)] scale-105 z-10" 
               : "bg-slate-950/50 border-white/10"
           )}>
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon text-slate-950 text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-black mb-6">
                 {plan.price}<span className="text-sm font-medium text-slate-500">/mo</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                 {plan.features.map(feat => (
                   <li key={feat} className="flex items-center gap-3 text-slate-300 text-sm">
                      <div className="bg-neon/10 p-1 rounded-full text-neon">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      {feat}
                   </li>
                 ))}
              </ul>
              
              <Link 
                href={`/register?plan=${plan.id}`}
                className={cn(
                "w-full py-3 rounded-full font-bold text-sm transition-all block text-center",
                plan.highlight ? "bg-neon text-slate-950 hover:bg-neon-hover" : "bg-white/10 text-white hover:bg-white/20"
              )}>
                Get Started
              </Link>
           </div>
         ))}
      </div>
    </div>
  )
}
