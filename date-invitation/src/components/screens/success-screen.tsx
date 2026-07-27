"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useHaptics } from "@/hooks/use-haptics";
import { downloadIcs } from "@/lib/ics";
import { getTimeSlot, type DatePlan } from "@/lib/constants";

interface SuccessScreenProps {
  plan: DatePlan;
}

/** Big gradient heart, beating forever with a soft glow underneath. */
function BigHeart() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -12 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
      className="mx-auto mb-8 w-fit"
    >
      <div
        className="animate-heartbeat"
        style={{ filter: "drop-shadow(0 22px 44px rgb(232 106 146 / 0.5))" }}
      >
        <svg width="118" height="109" viewBox="0 0 32 29.6" aria-hidden>
          <defs>
            <linearGradient id="heart-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E86A92" />
              <stop offset="100%" stopColor="#8E3B57" />
            </linearGradient>
          </defs>
          <path
            fill="url(#heart-gradient)"
            d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2 c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"
          />
        </svg>
      </div>
    </motion.div>
  );
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

/** Screen 3 — the happy ending, with the add-to-calendar action. */
export function SuccessScreen({ plan }: SuccessScreenProps) {
  const { vibrate } = useHaptics();
  const [thanksOpen, setThanksOpen] = useState(false);
  const slot = getTimeSlot(plan.slot);

  const handleAddToCalendar = () => {
    downloadIcs(plan);
    vibrate([14, 30, 18]);
    // Give the download a beat before showing the thank-you window.
    setTimeout(() => setThanksOpen(true), 650);
  };

  return (
    <Card className="mx-auto w-full max-w-lg px-6 py-12 text-center sm:px-12 sm:py-14">
      <BigHeart />

      <motion.h1
        {...fadeUp(0.45)}
        className="text-balance text-2xl font-bold tracking-tight text-bordeaux sm:text-3xl"
      >
        Super, j’ai hâte de passer ce moment avec toi.
      </motion.h1>

      <motion.p {...fadeUp(0.65)} className="mt-5 text-lg text-bordeaux/80">
        Bisous 😽❤️
      </motion.p>

      <motion.p {...fadeUp(0.85)} className="mt-3 text-lg font-semibold text-bordeaux">
        🌸❤️ Je t’aime fort ❤️🌸
      </motion.p>

      {/* Recap of the chosen moment */}
      <motion.div
        {...fadeUp(1.05)}
        className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full border
          border-bordeaux/10 bg-white/70 px-5 py-2 text-sm font-semibold text-bordeaux/70"
      >
        <span>{slot.emoji}</span>
        <span className="capitalize">
          {format(plan.date, "EEEE d MMMM", { locale: fr })}
        </span>
        <span aria-hidden>·</span>
        <span>{slot.label}</span>
      </motion.div>

      <motion.div {...fadeUp(1.2)} className="mt-6">
        <Button size="lg" onClick={handleAddToCalendar}>
          📅 Ajouter au calendrier
        </Button>
      </motion.div>

      <Modal open={thanksOpen} onClose={() => setThanksOpen(false)}>
        <p className="text-4xl" aria-hidden>
          ❤️
        </p>
        <h2 className="mt-4 text-xl font-bold text-bordeaux">
          Merci d’avoir accepté ❤️
        </h2>
        <p className="mt-3 text-bordeaux/70">
          Maintenant il ne reste plus qu’à attendre ce beau moment avec impatience 😊
        </p>
        <Button variant="soft" className="mt-7" onClick={() => setThanksOpen(false)}>
          À très vite 💕
        </Button>
      </Modal>
    </Card>
  );
}
