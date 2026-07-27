"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EvasiveNoButton } from "@/components/invitation/evasive-no-button";
import { useHaptics } from "@/hooks/use-haptics";

interface InvitationScreenProps {
  onAccept: () => void;
  /** Spawn a heart explosion at a viewport position. */
  onBurst: (x: number, y: number) => void;
  onToast: (message: string) => void;
}

/** Screen 1 — the big question. */
export function InvitationScreen({ onAccept, onBurst, onToast }: InvitationScreenProps) {
  const { vibrate } = useHaptics();
  const yesRef = useRef<HTMLButtonElement>(null);
  const [accepted, setAccepted] = useState(false);
  const [noGone, setNoGone] = useState(false);

  const handleYes = () => {
    if (accepted) return;
    setAccepted(true);
    vibrate([18, 40, 24]);
    const rect = yesRef.current?.getBoundingClientRect();
    if (rect) onBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    // Let the hearts fly for a beat before switching screens.
    setTimeout(onAccept, 650);
  };

  return (
    <Card className="mx-auto w-full max-w-lg px-6 py-12 text-center sm:px-12 sm:py-16">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
        className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl
          bg-gradient-to-br from-rose to-bordeaux shadow-lg shadow-rose/35"
      >
        <Heart className="h-7 w-7 text-white" fill="currentColor" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        className="text-balance text-3xl font-bold tracking-tight text-bordeaux sm:text-4xl"
      >
        Ça te dit un date avec moi ? ❤️
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.38, ease: "easeOut" }}
        className="mt-4 text-base text-bordeaux/60 sm:text-lg"
      >
        J’ai une petite surprise à te proposer…
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        {/* The "Oui" button never moves — soft infinite pulse + premium hover. */}
        <motion.button
          ref={yesRef}
          type="button"
          onClick={handleYes}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="animate-pulse-ring inline-flex h-12 items-center justify-center gap-2
            rounded-full bg-gradient-to-br from-rose to-bordeaux px-9 text-base font-semibold
            text-white shadow-lg shadow-rose/30 transition-shadow duration-300
            hover:shadow-xl hover:shadow-rose/45 focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-rose/60 focus-visible:ring-offset-2"
        >
          ❤️ Oui
        </motion.button>

        <EvasiveNoButton
          onTease={() => onToast("Tu abandonnes pas hein ? 😂")}
          onVanish={({ x, y }) => {
            setNoGone(true);
            onBurst(x, y);
            vibrate(30);
          }}
        />
      </motion.div>

      <AnimatePresence>
        {noGone && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-sm font-medium text-bordeaux/50"
          >
            Bon… il ne reste plus qu’une seule réponse 😏
          </motion.p>
        )}
      </AnimatePresence>
    </Card>
  );
}
