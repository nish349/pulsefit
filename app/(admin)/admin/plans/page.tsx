
import { Suspense } from "react";
import { getAdminPlans } from "@/app/actions/plans";
import PlansManager from "@/components/admin/plans-manager";

// Force dynamic behavior so it always fetches fresh data on visit
export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const plans = await getAdminPlans();

  return (
    <div className="pb-20">
      <Suspense fallback={<div className="text-white">Loading plans...</div>}>
         <PlansManager initialPlans={plans} />
      </Suspense>
    </div>
  );
}
