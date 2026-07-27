"use client";

import { useCallback } from "react";

/**
 * Haptic feedback via the Vibration API. Silently does nothing on
 * browsers that don't support it (iOS Safari, desktop…).
 */
export function useHaptics() {
  const vibrate = useCallback((pattern: number | number[] = 12) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Some browsers throw when vibration is blocked — ignore.
      }
    }
  }, []);

  return { vibrate };
}
