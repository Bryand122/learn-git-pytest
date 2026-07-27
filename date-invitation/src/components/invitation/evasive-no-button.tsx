"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { useDeviceType } from "@/hooks/use-device-type";
import { useHaptics } from "@/hooks/use-haptics";
import { randomBetween } from "@/lib/utils";

interface EvasiveNoButtonProps {
  /** Fired once, when it's time to show the "Tu abandonnes pas hein ? 😂" toast. */
  onTease: () => void;
  /** Fired when the button gives up, with its last viewport center position. */
  onVanish: (center: { x: number; y: number }) => void;
}

/** How close the mouse can get (px) before the button runs away. */
const FLEE_RADIUS = 90;
/** Minimum ms between two desktop escapes, to keep the motion elegant. */
const FLEE_COOLDOWN = 220;
/** Touch attempts before the teasing toast appears. */
const TEASE_AT = 4;
/** Touch attempts before the button disappears for good. */
const VANISH_AT = 7;
/** Margin kept between the button and the viewport edges. */
const EDGE_MARGIN = 16;

/**
 * The "Non" button nobody manages to press.
 *
 * - Desktop: flees with a fluid spring as soon as the cursor gets close,
 *   always staying inside the viewport.
 * - Mobile: jumps away on every tap attempt and shrinks a little; after a
 *   few tries it teases with a toast, then disappears.
 * - Tablet: same as mobile with an extra playful rotation, vanishing into
 *   a burst of small hearts (triggered by the parent via `onVanish`).
 */
export function EvasiveNoButton({ onTease, onVanish }: EvasiveNoButtonProps) {
  const device = useDeviceType();
  const { vibrate } = useHaptics();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastFleeAt = useRef(0);
  const attemptsRef = useRef(0);

  const [visible, setVisible] = useState(true);
  const [shrink, setShrink] = useState(1);
  const [tilt, setTilt] = useState(0);

  // Springy offsets so every escape feels smooth, never teleported.
  const x = useSpring(0, { stiffness: 260, damping: 22, mass: 0.8 });
  const y = useSpring(0, { stiffness: 260, damping: 22, mass: 0.8 });

  /** Move to a random spot in the viewport, as far as possible from (fromX, fromY). */
  const flee = useCallback(
    (fromX?: number, fromY?: number) => {
      const el = buttonRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // The untranslated position of the button in the viewport.
      const baseLeft = rect.left - x.get();
      const baseTop = rect.top - y.get();
      const maxLeft = window.innerWidth - rect.width - EDGE_MARGIN;
      const maxTop = window.innerHeight - rect.height - EDGE_MARGIN;

      // Sample a few candidates and keep the one farthest from the pointer,
      // so the button never lands right back under the finger/cursor.
      let best = { left: EDGE_MARGIN, top: EDGE_MARGIN };
      let bestDistance = -1;
      for (let i = 0; i < 10; i++) {
        const left = randomBetween(EDGE_MARGIN, Math.max(EDGE_MARGIN, maxLeft));
        const top = randomBetween(EDGE_MARGIN, Math.max(EDGE_MARGIN, maxTop));
        const distance =
          fromX === undefined || fromY === undefined
            ? Math.random()
            : Math.hypot(left + rect.width / 2 - fromX, top + rect.height / 2 - fromY);
        if (distance > bestDistance) {
          bestDistance = distance;
          best = { left, top };
        }
      }

      x.set(best.left - baseLeft);
      y.set(best.top - baseTop);
    },
    [x, y]
  );

  // Desktop: watch the cursor and run away before it can even hover.
  useEffect(() => {
    if (device !== "desktop" || !visible) return;

    const handleMouseMove = (event: MouseEvent) => {
      const el = buttonRef.current;
      if (!el) return;
      const now = performance.now();
      if (now - lastFleeAt.current < FLEE_COOLDOWN) return;

      const rect = el.getBoundingClientRect();
      const distance = Math.hypot(
        rect.left + rect.width / 2 - event.clientX,
        rect.top + rect.height / 2 - event.clientY
      );
      if (distance < FLEE_RADIUS) {
        lastFleeAt.current = now;
        flee(event.clientX, event.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [device, visible, flee]);

  /** Touch attempt (mobile & tablet): dodge, shrink, tease, then give up. */
  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse") return; // desktop is handled by proximity
    event.preventDefault();

    const attempts = ++attemptsRef.current;
    vibrate(15);
    flee(event.clientX, event.clientY);

    // Progressive shrink, a bit of playful rotation on tablets.
    setShrink(Math.max(0.55, 1 - attempts * 0.07));
    if (device === "tablet") setTilt(randomBetween(-14, 14));

    if (attempts === TEASE_AT) onTease();

    if (attempts >= VANISH_AT) {
      const rect = buttonRef.current?.getBoundingClientRect();
      setVisible(false);
      if (rect) {
        onVanish({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          ref={buttonRef}
          type="button"
          aria-label="Non"
          onPointerDown={handlePointerDown}
          style={{ x, y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: shrink, rotate: tilt }}
          exit={{ opacity: 0, scale: 0, rotate: 30 }}
          transition={{ type: "spring", stiffness: 320, damping: 20 }}
          className="relative z-30 inline-flex h-12 touch-none select-none items-center
            justify-center gap-2 rounded-full border border-bordeaux/10 bg-white/80 px-7
            text-base font-semibold text-bordeaux/70 shadow-sm shadow-bordeaux/10
            backdrop-blur-sm"
        >
          🙈 Non
        </motion.button>
      )}
    </AnimatePresence>
  );
}
