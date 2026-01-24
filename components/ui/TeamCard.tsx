'use client';

import { TeamMember } from '@/lib/mockData';
import Image from 'next/image';

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="relative p-8 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-sm flex flex-col md:flex-row gap-8 items-center max-w-4xl mx-auto hover:bg-slate-900/80 transition-colors group">
      <div className="relative w-40 h-40 md:w-64 md:h-64 flex-shrink-0">
         <Image 
           src={member.image} 
           alt={member.name}
           fill
           className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
         />
      </div>
      
      <div className="flex-1 text-left">
         <div className="flex flex-col gap-2 mb-4">
            <h4 className="text-2xl font-bold text-white">{member.name}</h4>
            <div className="inline-block bg-neon/10 text-neon px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
               {member.role}
            </div>
         </div>
         
         <p className="text-slate-400 leading-relaxed text-lg">
           {member.bio}
         </p>
      </div>
    </div>
  )
}
