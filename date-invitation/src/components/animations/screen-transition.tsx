"use client";

import { motion } from "framer-motion";

/**
 * Shared enter/exit choreography for the three screens —
 * a soft Apple-like fade + slide + zoom driven by a spring.
 */
export function ScreenTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="relative z-10 w-full"
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
    >
      {children}
    </motion.div>
  );
}
