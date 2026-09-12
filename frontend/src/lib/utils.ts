import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names, letting later classes win over earlier ones
 * even when they belong to the same utility group (e.g. a `px-4` default
 * overridden by a caller's `px-8`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a statistic for display. Large whole numbers get thousands
 * separators; figures that carry decimals (45.9M) keep exactly as many
 * places as the data declares, so the count-up animation does not jitter
 * between one and two decimals as it runs.
 */
export function formatStatValue(value: number, decimals = 0) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
