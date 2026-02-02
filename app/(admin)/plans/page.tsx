import { getAdminPlans } from "@/app/actions/plans";
import PlansManager from "@/components/admin/plans-manager";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const plans = await getAdminPlans();

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <PlansManager initialPlans={plans} />
    </div>
  );
}
