"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { PetalRain } from "@/components/animations/petal-rain";

/**
 * Full-screen interlude between confirmation and the final screen:
 * an elegant loader surrounded by raining petals, hearts and a soft glow.
 */
export function CelebrationOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <PetalRain />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.15 }}
        className="glass card-light relative z-50 flex flex-col items-center gap-5 rounded-[1.75rem]
          px-10 py-9 shadow-xl shadow-bordeaux/15"
      >
        {/* Spinning ring with a beating heart inside */}
        <div className="relative h-16 w-16">
          <motion.span
            className="absolute inset-0 rounded-full border-[3px] border-rose/20 border-t-rose"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <Heart className="animate-heartbeat h-6 w-6 text-rose" fill="currentColor" />
          </span>
        </div>
        <p className="text-sm font-semibold text-bordeaux/70">
          Je prépare notre moment…
        </p>
      </motion.div>
    </motion.div>
  );
}
