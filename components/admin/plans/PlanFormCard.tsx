"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Plus, Loader2, Check } from "lucide-react";
import { PlanFormValues } from "@/types";

export function PlanFormCard({
  data,
  setData,
  onSave,
  onCancel,
  loading,
  isNew
}: {
  data: PlanFormValues;
  setData: (d: PlanFormValues) => void;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
  isNew?: boolean;
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
