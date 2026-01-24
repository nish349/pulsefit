'use client';

import { reviews } from '@/lib/mockData';
import { Star } from 'lucide-react';

export default function GoogleReviews() {
  return (
    <section id="testimonials" className="py-24 px-4 bg-slate-950 border-t border-white/5 overflow-hidden">
      <div className="container mx-auto max-w-7xl mb-12 text-center">
         <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
            What Our Members Say
         </h2>
         <div className="flex items-center justify-center gap-2 text-slate-400">
            <span className="font-bold text-white">4.9/5</span>
            <div className="flex text-yellow-500">
               {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <span>based on 128 Google Reviews</span>
         </div>
      </div>

      {/* Marquee Effect Wrapper - simpler grid for now, can be marquee later */}
      <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
         {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full flex flex-col gap-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                        {review.author[0]}
                     </div>
                     <div>
                        <div className="font-bold text-slate-900 text-sm">{review.author}</div>
                        <div className="text-xs text-slate-500">{review.time}</div>
                     </div>
                  </div>
                  {/* Google G Logo Placeholder or Icon */}
                  <div className="text-xl font-bold text-slate-500">G</div>
               </div>

               <div className="flex text-yellow-500">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
               </div>

               <p className="text-slate-600 text-sm leading-relaxed">
                  {review.text}
               </p>
            </div>
         ))}
      </div>
    </section>
  )
}
