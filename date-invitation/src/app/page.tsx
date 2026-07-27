"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { FloatingHearts } from "@/components/floating-hearts/floating-hearts";
import { HeartBurstLayer, type Burst } from "@/components/animations/heart-burst";
import { ScreenTransition } from "@/components/animations/screen-transition";
import { InvitationScreen } from "@/components/screens/invitation-screen";
import { ScheduleScreen } from "@/components/screens/schedule-screen";
import { CelebrationOverlay } from "@/components/screens/celebration-overlay";
import { SuccessScreen } from "@/components/screens/success-screen";
import { Toast } from "@/components/ui/toast";
import type { DatePlan } from "@/lib/constants";

type Phase = "invitation" | "schedule" | "celebration" | "success";

/** How long the petal/heart celebration plays before the final screen. */
const CELEBRATION_MS = 3200;
const TOAST_MS = 2600;

export default function Home() {
  const [phase, setPhase] = useState<Phase>("invitation");
  const [plan, setPlan] = useState<DatePlan | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstId = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  const spawnBurst = useCallback((x: number, y: number) => {
    setBursts((prev) => [...prev, { id: ++burstId.current, x, y }]);
  }, []);

  const removeBurst = useCallback((id: number) => {
    setBursts((prev) => prev.filter((burst) => burst.id !== id));
  }, []);

  // The celebration is a timed interlude before the final reveal.
  useEffect(() => {
    if (phase !== "celebration") return;
    const timer = setTimeout(() => setPhase("success"), CELEBRATION_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative flex min-h-dvh items-center justify-center px-4 py-10 sm:px-6">
        <FloatingHearts />

        <AnimatePresence mode="wait">
          {phase === "invitation" && (
            <ScreenTransition key="invitation">
              <InvitationScreen
                onAccept={() => setPhase("schedule")}
                onBurst={spawnBurst}
                onToast={showToast}
              />
            </ScreenTransition>
          )}

          {phase === "schedule" && (
            <ScreenTransition key="schedule">
              <ScheduleScreen
                onConfirm={(nextPlan) => {
                  setPlan(nextPlan);
                  setPhase("celebration");
                }}
              />
            </ScreenTransition>
          )}

          {phase === "success" && plan && (
            <ScreenTransition key="success">
              <SuccessScreen plan={plan} />
            </ScreenTransition>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "celebration" && <CelebrationOverlay key="celebration" />}
        </AnimatePresence>

        <HeartBurstLayer bursts={bursts} onDone={removeBurst} />
        <Toast message={toast} />
      </main>
    </MotionConfig>
  );
}
