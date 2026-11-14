import type { EstimatorItem } from "../lib/estimate";

/** Rough average weights in kg, unchanged from the original site. */
export const estimatorItems: readonly EstimatorItem[] = [
  { id: "q0", label: "Phones and tablets", kg: 0.2, initial: 40 },
  { id: "q1", label: "Laptops", kg: 2.5, initial: 25 },
  { id: "q2", label: "Desktop computers", kg: 9, initial: 10 },
  { id: "q3", label: "Monitors and TVs", kg: 6, initial: 10 },
  { id: "q4", label: "Printers", kg: 8, initial: 3 },
  { id: "q5", label: "Solar batteries and UPS units", kg: 7, initial: 2 },
];
