'use client';

import Image from 'next/image';
import { Send, MapPin, Mail, Phone } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 px-4 bg-slate-950 border-t border-white/5">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Form */}
          <div className="lg:w-1/2 w-full">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon/10 text-neon text-xs font-bold uppercase tracking-wider mb-6">
                <Send size={14} /> Contact us
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                Get in touch
             </h2>
             <p className="text-slate-400 mb-8">
                Ready to take your game to the next level? Send us a message and we'll be in touch shortly.
             </p>

             <form className="space-y-6">
                <div>
                   <label htmlFor="name" className="block text-sm font-bold text-white mb-2">Name</label>
                   <input 
                     type="text" 
                     id="name" 
                     placeholder="Enter your name" 
                     className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-neon transition-colors"
                   />
                </div>
                <div>
                   <label htmlFor="email" className="block text-sm font-bold text-white mb-2">Email</label>
                   <input 
                     type="email" 
                     id="email" 
                     placeholder="e.g. johndoe@gmail.com" 
                     className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-neon transition-colors"
                   />
                </div>
                <div>
                   <label htmlFor="message" className="block text-sm font-bold text-white mb-2">Message</label>
                   <textarea 
                     id="message" 
                     rows={4}
                     placeholder="Type your message..." 
                     className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-neon transition-colors resize-none"
                   />
                </div>
                
                <div className="flex items-center gap-3">
                   <input type="checkbox" id="terms" className="w-5 h-5 rounded border-white/10 bg-slate-900 text-neon focus:ring-neon" />
                   <label htmlFor="terms" className="text-sm text-slate-400">
                      I accept the <a href="#" className="underline hover:text-white">Terms</a>
                   </label>
                </div>

                <button className="bg-neon text-slate-950 font-bold px-8 py-3 rounded-xl hover:bg-neon-hover transition-colors shadow-lg shadow-neon/20 w-fit">
                   Submit
                </button>
             </form>
          </div>

          {/* Right: Image & Card */}
          <div className="lg:w-1/2 w-full relative">
             <div className="relative rounded-3xl overflow-hidden h-[600px] w-full">
                <Image 
                   src="/demo-images/coaching.jpg" 
                   alt="Athlete drinking water" 
                   fill
                   className="object-cover"
                />
                
                {/* Contact Info Card Overlay */}
                <div className="absolute bottom-8 left-8 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl max-w-sm w-[calc(100%-4rem)] animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h3 className="text-xl font-bold text-white mb-6">Visit Us</h3>

                    <div className="space-y-6">
                       <div className="flex items-start gap-4">
                          <div className="bg-neon/10 rounded-full p-3 text-neon">
                             <MapPin size={20} />
                          </div>
                          <div>
                             <div className="font-bold text-white text-sm mb-1">Location</div>
                             <div className="text-sm text-slate-400">123 Fitness Blvd, Gym City, GC 12345</div>
                          </div>
                       </div>

                       <div className="flex items-start gap-4">
                          <div className="bg-neon/10 rounded-full p-3 text-neon">
                             <Mail size={20} />
                          </div>
                          <div>
                             <div className="font-bold text-white text-sm mb-1">Email</div>
                             <div className="text-sm text-slate-400">contact@pulsefit.com</div>
                          </div>
                       </div>

                       <div className="flex items-start gap-4">
                          <div className="bg-neon/10 rounded-full p-3 text-neon">
                             <Phone size={20} />
                          </div>
                          <div>
                             <div className="font-bold text-white text-sm mb-1">Phone</div>
                             <div className="text-sm text-slate-400">+1 (555) 123-4567</div>
                          </div>
                       </div>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  )
}

function ChevronRightIcon() {
   return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="m9 18 6-6-6-6"/>
      </svg>
   )
}
