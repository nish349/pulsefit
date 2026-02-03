'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { Plan } from '@/types';

interface PricingGridProps {
  plans: Plan[];
}

export default function PricingGrid({ plans }: PricingGridProps) {
  if (!plans || plans.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {plans.map(plan => (
        <div key={plan.id} className={cn(
          "relative p-8 rounded-3xl border flex flex-col",
          "bg-slate-950/50 border-white/10"
        )}>
          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
          <div className="text-4xl font-black mb-6">
            ₹{plan.price}<span className="text-sm font-medium text-slate-500">/mo</span>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            {plan.features?.map(feat => (
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
              "w-full py-3 rounded-full font-bold text-sm transition-all block text-center bg-white/10 text-white hover:bg-white/20"
            )}>
            Get Started
          </Link>
        </div>
      ))}
    </div>
  );
}
