"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ToastProps {
  message: string | null;
}

/**
 * Minimal glass toast pinned to the bottom of the screen.
 * Render with `message = null` to hide it; the parent owns the timer.
 */
export function Toast({ message }: ToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="glass rounded-full px-6 py-3 text-sm font-semibold text-bordeaux shadow-lg shadow-bordeaux/15"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
