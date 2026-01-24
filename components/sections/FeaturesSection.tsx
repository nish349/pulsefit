'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { services } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface FeaturesSectionProps {
  limit?: number;
}

export default function FeaturesSection({ limit }: FeaturesSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(limit ? 1 : 2); // Center logic roughly
  
  const displayServices = limit ? services.slice(0, limit) : services;

  return (
    <section className="py-24 px-4 bg-slate-950">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Facility
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              World-Class Zones
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl">
              Elite methodologies combined with cutting-edge technology for complete athletic dominance.
            </p>
          </div>
          
          {limit && (
             <Link href="/facility" className="flex items-center gap-2 text-neon font-bold hover:text-white transition-colors whitespace-nowrap">
                View All Facility <ChevronRight />
             </Link>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 h-[600px] w-full">
          {displayServices.map((service, i) => {
             const isHovered = hoveredIndex === i;
             return (
              <motion.div
                key={service.title}
                className={cn(
                  "relative overflow-hidden rounded-3xl border border-white/10 cursor-pointer h-full",
                  "group transition-all duration-500 ease-in-out"
                )}
                layout
                initial={{ flex: 1 }}
                animate={{ 
                  flex: isHovered ? 3 : 1,
                  opacity: hoveredIndex !== null && !isHovered ? 0.6 : 1
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(limit ? 1 : 2)}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-8 w-full">
                   <motion.div 
                     className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-4 border border-white/10"
                     layout
                   >
                      <span className="text-xs font-bold text-white uppercase">{service.title}</span>
                   </motion.div>
                   
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ 
                        opacity: isHovered ? 1 : 0,
                        height: isHovered ? 'auto' : 0
                     }}
                     transition={{ duration: 0.3 }}
                   >
                     <p className="text-slate-300 font-medium leading-relaxed whitespace-normal line-clamp-3 md:line-clamp-none">
                        {service.description}
                     </p>
                   </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
