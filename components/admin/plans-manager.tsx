"use client";

import { useState } from "react";
import { upsertPlan, togglePlanStatus, deletePlan } from "@/app/actions/plans";
import { cn } from "@/lib/utils";
import {
  Edit2,
  Trash2,
  Check,
  Archive,
  RefreshCcw,
  Loader2,
  Plus,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { PlanWithDetails, PlanFormValues } from "@/types";
import { ConfirmationModal } from "@/components/admin/plans/ConfirmationModal";
import { PlanDisplayCard } from "@/components/admin/plans/PlanDisplayCard";
import { PlanFormCard } from "@/components/admin/plans/PlanFormCard";

interface PlansManagerProps {
  initialPlans: PlanWithDetails[];
}

export default function PlansManager({ initialPlans }: PlansManagerProps) {
  const [plans, setPlans] = useState<PlanWithDetails[]>(initialPlans);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State for the plan currently being edited/created
  const [formData, setFormData] = useState<PlanFormValues>({
    name: "",
    price: 0,
    features: [],
    isActive: true,
  });

  const handleEdit = (plan: PlanWithDetails) => {
    setEditingId(plan.id);
    setFormData({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      // Ensure features is never null for form
      features: plan.features || [],
      isActive: plan.isActive ?? true,
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      name: "New Plan",
      price: 0,
      features: ["Feature 1"],
      isActive: true,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
  };


  /* -------------------------------------------------------------------------
     NEW: Use Server Actions directly
     ------------------------------------------------------------------------- */
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    try {
      // 1. Prepare Payload
      const payload: PlanFormValues = {
        ...formData,
        // Ensure price is valid number
        price: Number(formData.price) || 0,
        // Filter out empty features
        features: formData.features.filter(f => f.trim() !== "")
      };

      // 2. Call Server Action
      const result = await upsertPlan(payload);

      if (!result.success || !result.plan) {
        throw new Error(result.error || "Failed to save plan");
      }

      // 3. Success Feedback
      setEditingId(null);
      setIsCreating(false);

      // 4. Update UI - IMMEDIATE LOCAL UPDATE
      const saved = result.plan;
      const completePlan: PlanWithDetails = {
        id: saved.id!,
        name: saved.name,
        price: saved.price,
        features: saved.features || [],
        isActive: saved.isActive ?? true,
        // Preserve existing member count if editing, or 0 for new
        activeMemberCount: editingId
          ? plans.find(p => p.id === saved.id)?.activeMemberCount || 0
          : 0
      };

      setPlans(current => {
        const exists = current.find(p => p.id === saved.id);
        if (exists) {
          return current.map(p => p.id === saved.id ? completePlan : p);
        } else {
          return [...current, completePlan];
        }
      });

      router.refresh();

    } catch (error) {
      console.error("Failed to save", error);
      alert("Error saving plan: " + error);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------
     Smart Delete / Archive Logic
     ------------------------------------------------------------------------- */
  const [pendingAction, setPendingAction] = useState<{ plan: PlanWithDetails, type: 'delete' | 'archive' | 'activate' } | null>(null);

  const handleSmartDeleteRequest = (plan: PlanWithDetails) => {
    const isHardDelete = plan.isActive && plan.activeMemberCount === 0;
    setPendingAction({
      plan,
      type: isHardDelete ? 'delete' : (plan.isActive ? 'archive' : 'activate')
    });
  };

  const executePendingAction = async () => {
    if (!pendingAction) return;
    const { plan, type } = pendingAction;

    setPendingAction(null);
    const previousPlans = [...plans];

    // Optimistic Update
    if (type === 'delete') {
      setPlans(plans.filter(p => p.id !== plan.id));
    } else {
      setPlans(plans.map(p => p.id === plan.id ? { ...p, isActive: !p.isActive } : p));
    }

    try {
      if (type === 'delete') {
        const res = await deletePlan(plan.id);
        if (!res.success) throw new Error(res.error);
      } else {
        await togglePlanStatus(plan.id);
      }
      router.refresh();
    } catch (error) {
      console.error("Operation failed", error);
      alert("Operation failed: " + error);
      setPlans(previousPlans);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Manage Plans</h2>
          <p className="text-slate-400">Configure subscription tiers and pricing.</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="bg-neon text-slate-950 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-neon-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Plus size={18} /> Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Create Mode Card */}
        {isCreating && (
          <PlanFormCard
            data={formData}
            setData={setFormData}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={loading}
            isNew
          />
        )}

        {/* Existing Plans */}
        {plans.map((plan) => (
          editingId === plan.id ? (
            <PlanFormCard
              key={plan.id}
              data={formData}
              setData={setFormData}
              onSave={handleSave}
              onCancel={handleCancel}
              loading={loading}
            />
          ) : (
            <PlanDisplayCard
              key={plan.id}
              plan={plan}
              onEdit={() => handleEdit(plan)}
              onDelete={() => handleSmartDeleteRequest(plan)}
            />
          )
        ))}
      </div>

      <AnimatePresence>
        {pendingAction && (
          <ConfirmationModal
            isOpen={!!pendingAction}
            type={pendingAction.type}
            onConfirm={executePendingAction}
            onCancel={() => setPendingAction(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
