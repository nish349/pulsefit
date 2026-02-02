'use client';

import { useState } from 'react';
import { faqs } from '@/lib/demo-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-4 bg-slate-950">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: Title */}
          <div className="lg:w-1/3">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
              Got questions?
            </h2>
            <p className="text-slate-400 text-lg">
              Here's everything you need to know to get started and stay ahead.
            </p>
          </div>

          {/* Right: Accordion */}
          <div className="lg:w-2/3 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden transition-colors hover:bg-slate-900"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="text-lg font-bold text-white">{faq.question}</span>
                    <div className="flex-shrink-0 ml-4 text-neon">
                       {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                         <div className="px-6 pb-6 text-slate-400 leading-relaxed">
                            {faq.answer}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
