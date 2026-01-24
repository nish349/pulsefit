'use client';

import { Car, Droplets, Lock, Star } from 'lucide-react';

export default function PremiumStandardSection() {
  const features = [
    {
      title: 'Member Parking',
      icon: Car,
      description: 'Dedicated secure parking spots including EV charging stations.',
      color: 'text-blue-400',
    },
    {
      title: 'Recovery Suite',
      icon: Droplets, // Using Droplets for Droplet/Waves
      description: 'Premium steam, sauna, and cold plunge specifically for recovery.',
      color: 'text-cyan-400',
    },
    {
      title: 'Smart Lockers',
      icon: Lock,
      description: 'RFID-enabled secure lockers with built-in device charging.',
      color: 'text-emerald-400',
    },
    {
      title: 'Elite Coaching',
      icon: Star,
      description: 'Access to certified Olympic-level trainers and physiotherapists.',
      color: 'text-purple-400',
    },
  ];

  return (
    <section className="py-24 px-4 bg-slate-900 border-t border-white/5">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
            The Premium Standard
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We've elevated every detail of the gym experience to ensure your focus stays entirely on your performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={feature.title}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center"
            >
              <div 
                className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500`}
              >
                <feature.icon size={32} className={`${feature.color} drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
