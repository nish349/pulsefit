import { team } from '@/lib/demo-data';
import { getPublicPlans } from '@/app/actions/plans';
import Link from 'next/link';
import Image from 'next/image';
import TeamCard from '@/components/ui/TeamCard';
import GoogleReviews from '@/components/sections/GoogleReviews';
import { ChevronRight } from 'lucide-react';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import PremiumStandardSection from '@/components/sections/PremiumStandardSection';
import PricingSection from '@/components/sections/PricingSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';

export default async function LandingPage() {
   const rawPlans = await getPublicPlans();

   // Ensure features is string[] not string[] | null
   const plans = rawPlans.map(p => ({
      ...p,
      features: p.features || []
   }));

   return (
      <div className="flex flex-col">
         {/* Hero Section */}
         <HeroSection />

         {/* Services Section */}
         <FeaturesSection limit={3} />

         {/* Premium Standard Section */}
         <PremiumStandardSection />

         {/* About Section (Team) */}
         <section id="about" className="py-24 px-4 relative">
            <div className="container mx-auto max-w-7xl text-center">
               <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-16">
                  Meet the Team
               </h2>
               <div className="space-y-8">
                  {team.map(member => (
                     <TeamCard key={member.id} member={member} />
                  ))}
               </div>

               <div className="mt-16">
                  <Link href="/about" className="inline-flex items-center gap-2 text-neon font-bold text-lg hover:underline underline-offset-4 transition-all group">
                     Full About Page <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
         </section>

         {/* Google Reviews (Testimonials) */}
         <GoogleReviews />

         {/* Pricing Section */}
         <PricingSection plans={plans} />

         {/* FAQ Section */}
         <FAQSection />

         {/* Contact Section */}
         <ContactSection />


         {/* CTA */}
         <section className="py-24 px-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-neon/5 -z-10" />
            <div className="max-w-3xl mx-auto space-y-8">
               <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                  Ready to Level Up?
               </h2>
               <p className="text-lg text-slate-400">
                  Join PulseFit today and get unlimited access to all facilities and our AI tracking platform.
               </p>
               <Link href="/pricing" className="inline-block bg-neon text-slate-950 font-bold px-8 py-4 rounded-full text-lg hover:bg-neon-hover transition-all shadow-[0_0_30px_rgba(190,242,100,0.3)]">
                  Start Your Journey
               </Link>
            </div>
         </section>
      </div>
   )
}
