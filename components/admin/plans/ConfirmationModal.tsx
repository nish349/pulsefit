"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trash2, Archive, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfirmationModal({
  isOpen,
  type,
  onConfirm,
  onCancel
}: {
  isOpen: boolean;
  type: 'delete' | 'archive' | 'activate';
  onConfirm: () => void;
  onCancel: () => void;
}) {
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
