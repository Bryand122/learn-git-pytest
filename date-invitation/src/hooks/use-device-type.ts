"use client";

import { useEffect, useState } from "react";

export type DeviceType = "desktop" | "mobile" | "tablet";

const TABLET_MIN_WIDTH = 768;

function detect(): DeviceType {
  if (typeof window === "undefined") return "desktop";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (!coarse) return "desktop";
  return window.innerWidth >= TABLET_MIN_WIDTH ? "tablet" : "mobile";
}

/**
 * Distinguish desktop (fine pointer) from mobile / tablet (coarse pointer),
 * so interactions can adapt to the device. Defaults to "desktop" on the
 * server and re-evaluates on mount and resize.
 */
export function useDeviceType(): DeviceType {
  const [device, setDevice] = useState<DeviceType>("desktop");

  useEffect(() => {
    const update = () => setDevice(detect());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return device;
}
