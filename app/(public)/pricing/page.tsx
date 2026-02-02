import { getPublicPlans } from '@/app/actions/plans';
import PricingGrid from '@/components/sections/PricingGrid';

export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const rawPlans = await getPublicPlans();

  // Sanitize
  const plans = rawPlans.map(p => ({
    ...p,
    features: p.features || []
  }));

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black italic tracking-tighter text-white mb-4">Pricing Plans</h1>
        <p className="text-slate-400">Choose the perfect plan for your journey.</p>
      </div>

      <PricingGrid plans={plans} />
    </div>
  )
}
