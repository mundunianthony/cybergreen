export interface EstimatorItem {
  /** Input id; also used for the label's `for` attribute. */
  id: string;
  label: string;
  /** Rough average weight of one item in kilograms. */
  kg: number;
  /** Quantity shown when the page loads. */
  initial: number;
}

export interface EstimateLine {
  kg: number;
  quantity: number;
}

export interface Estimate {
  /** Total weight rounded to the nearest kilogram (Math.round, as in the original). */
  kg: number;
  count: number;
}

/**
 * Normalise a quantity field exactly like the original script:
 * `Math.max(0, parseInt(value || '0', 10) || 0)`.
 * Blank, negative and non-numeric input all become 0; decimals are truncated.
 */
export function parseQuantity(raw: string | null | undefined): number {
  return Math.max(0, parseInt(raw || "0", 10) || 0);
}

/** Apply a stepper button (+1 / -1) to a raw field value, never going below 0. */
export function stepQuantity(raw: string | null | undefined, step: number): number {
  return Math.max(0, (parseInt(raw || "0", 10) || 0) + step);
}

/** Sum weights in the given order (matching the original DOM-order accumulation) and round once. */
export function estimate(lines: readonly EstimateLine[]): Estimate {
  let kg = 0;
  let count = 0;
  for (const line of lines) {
    kg += line.quantity * line.kg;
    count += line.quantity;
  }
  return { kg: Math.round(kg), count };
}

export const formatInteger = (value: number): string => value.toLocaleString("en-US");
