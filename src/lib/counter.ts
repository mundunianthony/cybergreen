/** Animation length used by the original count-up, in milliseconds. */
export const COUNT_DURATION_MS = 1400;

/** Number of decimals implied by a data-count value, e.g. "2.5" -> 1, "41000" -> 0. */
export const decimalsOf = (raw: string): number => (raw.split(".")[1] ?? "").length;

export const easeOutCubic = (progress: number): number => 1 - Math.pow(1 - progress, 3);

export const formatCount = (value: number, decimals: number, prefix = ""): string =>
  prefix + value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
