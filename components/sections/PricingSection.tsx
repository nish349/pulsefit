'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Plan } from '@/types';

interface PricingSectionProps {
    plans: Plan[];
}

export default function PricingSection({ plans }: PricingSectionProps) {
    if (!plans || plans.length === 0) return null;

    return (
        <section className="py-24 bg-[#0a0f1c] relative overflow-hidden" id="pricing">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-6">
                        INVEST IN YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-cyan-400">POTENTIAL</span>
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Transparent pricing. No hidden fees. Choose the plan that fits your goals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 relative group hover:border-slate-700 transition-colors"
                        >
                            {/* Premium Highlight for middle plan */}
                            {index === 1 && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-neon to-cyan-500 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-neon/20">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-sm text-slate-400">₹</span>
                                <span className="text-5xl font-black text-white">{plan.price}</span>
                                <span className="text-slate-500">/mo</span>
                            </div>

                            <ul className="space-y-4 mb-8 min-h-[180px]">
                                {plan.features?.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-neon/10 transition-colors">
                                            <Check size={12} className="text-slate-400 group-hover:text-neon transition-colors" />
                                        </div>
                                        <span className="text-slate-300 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-4 rounded-xl bg-slate-800 text-white font-bold hover:bg-white hover:text-slate-950 transition-all duration-300">
                                Choose {plan.name}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
