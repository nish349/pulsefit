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

// --- Sub Components ---

function ConfirmationModal({ isOpen, type, onConfirm, onCancel }: { isOpen: boolean, type: 'delete' | 'archive' | 'activate', onConfirm: () => void, onCancel: () => void }) {
  if (!isOpen) return null;

  const config = {
    delete: {
      title: "Permanently Delete Plan?",
      description: "This plan has 0 active members. This action cannot be undone.",
      confirmText: "Delete Forever",
      icon: <Trash2 size={24} className="text-red-500" />,
      confirmClass: "bg-red-500 hover:bg-red-600 text-white"
    },
    archive: {
      title: "Archive Plan?",
      description: "Existing members will remain, but new members cannot subscribe to this plan.",
      confirmText: "Archive Plan",
      icon: <Archive size={24} className="text-amber-500" />,
      confirmClass: "bg-amber-500 hover:bg-amber-600 text-slate-900"
    },
    activate: {
      title: "Activate Plan?",
      description: "This plan will immediately become visible to the public.",
      confirmText: "Activate Plan",
      icon: <Check size={24} className="text-neon" />,
      confirmClass: "bg-neon hover:bg-neon-hover text-slate-900"
    }
  };

  const current = config[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-slate-800 rounded-full">
            {current.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{current.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{current.description}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-slate-300 font-medium hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={cn("px-4 py-2 rounded-lg font-bold transition-all shadow-lg", current.confirmClass)}
          >
            {current.confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function PlanDisplayCard({ plan, onEdit, onDelete }: { plan: PlanWithDetails, onEdit: () => void, onDelete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl p-6 border transition-all flex flex-col h-full relative group",
        plan.isActive
          ? "bg-slate-900 border-white/10 hover:border-white/20"
          : "bg-slate-950 border-red-900/30 opacity-75"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className={cn("p-2 rounded-lg transition-colors", plan.isActive ? "text-slate-400 hover:text-red-400 hover:bg-red-500/10" : "text-slate-400 hover:text-neon hover:bg-neon/10")}>
            {plan.isActive ? <Trash2 size={16} /> : <RefreshCcw size={16} />}
          </button>
        </div>
      </div>

      <div className="text-3xl font-black text-white mb-6">
        ₹{plan.price}<span className="text-lg font-medium text-slate-500">/month</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features?.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-neon flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs">
        <span className={cn("font-bold", plan.activeMemberCount > 0 ? "text-white" : "text-slate-500")}>
          {plan.activeMemberCount} active members
        </span>
        {!plan.isActive && (
          <span className="text-red-400 bg-red-500/10 px-2 py-1 rounded font-bold uppercase tracking-wider">Archived</span>
        )}
      </div>
    </motion.div>
  )
}

function PlanFormCard({
  data,
  setData,
  onSave,
  onCancel,
  loading,
  isNew
}: {
  data: PlanFormValues,
  setData: (d: PlanFormValues) => void,
  onSave: () => void,
  onCancel: () => void,
  loading: boolean,
  isNew?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 border border-neon/50 rounded-2xl p-6 ring-1 ring-neon/20"
    >
      <div className="mb-4 space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase">Plan Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white font-bold focus:border-neon focus:outline-none"
            placeholder="e.g. Gold Plan"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase">Monthly Price (₹)</label>
          <input
            type="number"
            value={data.price}
            onChange={(e) => setData({ ...data, price: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white font-bold focus:border-neon focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Features</label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {data.features.map((feature, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => {
                  const newF = [...data.features];
                  newF[idx] = e.target.value;
                  setData({ ...data, features: newF });
                }}
                className="flex-1 bg-slate-950/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:border-neon focus:outline-none"
              />
              <button
                onClick={() => {
                  const newF = [...data.features];
                  newF.splice(idx, 1);
                  setData({ ...data, features: newF });
                }}
                className="text-slate-500 hover:text-red-400 p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setData({ ...data, features: [...data.features, ""] })}
            className="text-xs text-neon font-bold flex items-center gap-1 hover:underline mt-2"
          >
            <Plus size={12} /> Add Feature
          </button>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
        <button
          onClick={onCancel}
          disabled={loading}
          className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
        <button
          onClick={onSave}
          disabled={loading}
          className="bg-neon text-slate-950 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-neon-hover shadow-lg shadow-neon/20 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
          {isNew ? "Create Plan" : "Save Changes"}
        </button>
      </div>
    </motion.div>
  )
}
