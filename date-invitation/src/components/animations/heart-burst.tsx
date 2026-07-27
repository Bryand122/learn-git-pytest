"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { randomBetween } from "@/lib/utils";

export interface Burst {
  id: number;
  x: number; // viewport px
  y: number; // viewport px
}

interface HeartBurstProps {
  burst: Burst;
  onDone: (id: number) => void;
}

const PARTICLES = 14;
const COLORS = ["#E86A92", "#8E3B57", "#F1A7C0", "#FFFFFF"];

/**
 * One-shot explosion of small hearts at a viewport position — used when
 * "Oui" is pressed and when the "Non" button finally gives up.
 */
export function HeartBurst({ burst, onDone }: HeartBurstProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLES }, (_, i) => {
        const angle = (i / PARTICLES) * Math.PI * 2 + randomBetween(-0.3, 0.3);
        const distance = randomBetween(60, 150);
        return {
          id: i,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance - 40, // slight upward bias
          size: randomBetween(10, 22),
          rotate: randomBetween(-90, 90),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
      }),
    []
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-50"
      style={{ left: burst.x, top: burst.y }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: p.dx, y: p.dy, scale: [0, 1.1, 0.9], opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={p.id === 0 ? () => onDone(burst.id) : undefined}
        >
          <Heart size={p.size} fill={p.color} stroke="none" />
        </motion.div>
      ))}
    </div>
  );
}

interface HeartBurstLayerProps {
  bursts: Burst[];
  onDone: (id: number) => void;
}

/** Renders every active burst; parents just push into the list. */
export function HeartBurstLayer({ bursts, onDone }: HeartBurstLayerProps) {
  return (
    <>
      {bursts.map((burst) => (
        <HeartBurst key={burst.id} burst={burst} onDone={onDone} />
      ))}
    </>
  );
}
