"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { randomBetween } from "@/lib/utils";

interface Particle {
  id: number;
  kind: "petal" | "heart";
  left: number; // vw
  size: number; // px
  duration: number; // s
  delay: number; // s
  sway: number; // px
  rotate: number; // deg
  color: string;
}

const PETAL_COLORS = ["#F9DBE5", "#F1A7C0", "#E86A92", "#FBEAF0"];
const HEART_COLORS = ["#E86A92", "#8E3B57", "#F1A7C0"];
const COUNT = 34;

/**
 * Celebration overlay: petals and small hearts raining down,
 * with a subtle pulsing light in the middle of the screen.
 */
export function PetalRain() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: COUNT }, (_, id) => {
        const kind = id % 3 === 0 ? "heart" : ("petal" as const);
        return {
          id,
          kind,
          left: randomBetween(0, 100),
          size: kind === "heart" ? randomBetween(10, 20) : randomBetween(10, 18),
          duration: randomBetween(3.4, 6.5),
          delay: randomBetween(0, 2.4),
          sway: randomBetween(-60, 60),
          rotate: randomBetween(-220, 220),
          color:
            kind === "heart"
              ? HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)]
              : PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        };
      })
    );
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {/* Subtle breathing light */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgb(232 106 146 / 0.18), transparent 65%)",
        }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.left}vw`, top: "-6%" }}
          initial={{ y: "-8vh", opacity: 0 }}
          animate={{
            y: "115vh",
            x: [0, p.sway, p.sway / 2],
            opacity: [0, 1, 1, 0.6],
            rotate: p.rotate,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {p.kind === "heart" ? (
            <Heart size={p.size} fill={p.color} stroke="none" />
          ) : (
            <span
              className="block"
              style={{
                width: p.size,
                height: p.size * 1.45,
                background: `linear-gradient(160deg, ${p.color}, #ffffffcc)`,
                borderRadius: "60% 40% 55% 45% / 70% 65% 35% 30%",
                boxShadow: "0 1px 4px rgb(142 59 87 / 0.12)",
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
