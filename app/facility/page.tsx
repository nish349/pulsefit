import { facilityCatalog } from '@/lib/mockData';
import FacilityGrid from '@/components/ui/FacilityGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Facilities | PulseFit',
  description: 'Explore our complete catalog of training zones, studios, and recovery areas.',
};

export default function FacilityPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <section className="pt-40 pb-16 px-4">
        <div className="container mx-auto max-w-7xl mb-12 text-center">
           <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
             The Gear Vault
           </h1>
           <p className="text-xl text-slate-400 max-w-2xl mx-auto">
             Explore our world-class training zones, premium studios, and recovery suites designed for peak performance.
           </p>
        </div>
      </section>

      {/* Unified Grid (Services + Zones + Classes) */}
      <section className="pb-24">
         <FacilityGrid categories={facilityCatalog} />
      </section>
    </div>
  );
}
