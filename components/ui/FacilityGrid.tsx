'use client';

import { InventoryCategory, FacilityItem } from '@/lib/demo-data';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function FacilityGrid({ categories }: { categories: (InventoryCategory | FacilityItem)[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px] max-w-7xl mx-auto p-4 grid-flow-dense">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={cn(
            "relative group overflow-hidden rounded-3xl border border-white/10 bg-slate-900 cursor-pointer",
            category.gridConfig
          )}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={category.backgroundImage}
              alt={category.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
            <h3 className="text-3xl font-bold uppercase tracking-tighter mb-2 translate-y-2 group-hover:translate-y-0 transition-transform text-white">
              {category.title}
            </h3>
            <p className="text-slate-300 text-sm mb-4 line-clamp-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              {category.description}
            </p>

            {/* Only render items if they exist (InventoryCategory) */}
            {'items' in category && category.items && (
              <div className="flex gap-2 flex-wrap translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                {(category.items as { name: string; count: number }[]).map((item) => (
                  <span key={item.name} className="text-xs font-semibold bg-white/10 backdrop-blur-md px-2 py-1 rounded text-neon border border-neon/20">
                    {item.count} {item.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>

  )
}
