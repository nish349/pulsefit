"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, RefreshCcw } from "lucide-react";
import { PlanWithDetails } from "@/types";

export function PlanDisplayCard({
  plan,
  onEdit,
  onDelete
}: {
  plan: PlanWithDetails;
  onEdit: () => void;
  onDelete: () => void;
}) {
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
