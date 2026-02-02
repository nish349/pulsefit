
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { getPublicPlans } from '@/app/actions/plans';
import { validPromoCodes } from '@/lib/constants';
import RegisterForm from '@/components/public/registration-form';

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const plans = await getPublicPlans();

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon/10 blur-[120px] -z-10 rounded-full mix-blend-screen" />
       
       <Suspense fallback={
         <div className="flex items-center justify-center min-h-[50vh]">
           <Loader2 className="animate-spin text-neon w-10 h-10" />
         </div>
       }>
          <RegisterForm plans={plans} />
       </Suspense>
    </div>
  );
}
