"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { randomBetween } from "@/lib/utils";

interface FloatingHeart {
  id: number;
  left: number; // vw
  size: number; // px
  duration: number; // s
  delay: number; // s
  opacity: number;
  sway: number; // px of horizontal drift
  color: string;
}

const HEART_COUNT = 14;
const COLORS = ["#E86A92", "#8E3B57", "#F1A7C0"];

/**
 * Discreet ambient layer: small hearts slowly drifting up behind the UI.
 * Generated on mount so SSR markup stays deterministic.
 */
export function FloatingHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    setHearts(
      Array.from({ length: HEART_COUNT }, (_, id) => ({
        id,
        left: randomBetween(2, 96),
        size: randomBetween(10, 26),
        duration: randomBetween(16, 30),
        delay: randomBetween(-24, 4),
        opacity: randomBetween(0.05, 0.14),
        sway: randomBetween(-40, 40),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    );
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{ left: `${heart.left}vw`, top: "100%" }}
          animate={{
            y: ["0vh", "-118vh"],
            x: [0, heart.sway, 0],
            rotate: [0, heart.sway > 0 ? 18 : -18, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Heart
            size={heart.size}
            fill={heart.color}
            stroke="none"
            style={{ opacity: heart.opacity }}
          />
        </motion.div>
      ))}
    </div>
  );
}
