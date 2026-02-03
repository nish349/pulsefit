"use client";

import { useState } from "react";
import { Megaphone, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mb-6"
      >
        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm py-3 px-4 rounded-xl flex justify-between items-start gap-3">
          <div className="flex items-start gap-3">
            <Megaphone size={16} className="mt-0.5 text-blue-400 shrink-0" />
            <span>
              <strong className="block text-blue-400 mb-0.5">Maintenance Alert</strong>
              Gym closed for maintenance this Sunday (10 AM - 2 PM).
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-blue-400/50 hover:text-blue-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
