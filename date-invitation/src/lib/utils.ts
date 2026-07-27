import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Random float in [min, max). */
export function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}
