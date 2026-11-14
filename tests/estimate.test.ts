import { describe, expect, it } from "vitest";
import { estimatorItems } from "../src/data/estimator";
import { estimate, formatInteger, parseQuantity, stepQuantity } from "../src/lib/estimate";

/**
 * Reference: the calculation from the original assets/js/main.js, copied verbatim apart from
 * replacing DOM reads with plain values.
 */
function originalCalc(values: string[], weights: number[]): { kg: string; n: string; normalised: string[] } {
  let kg = 0;
  let n = 0;
  const normalised: string[] = [];
  values.forEach((value, idx) => {
    const v = Math.max(0, parseInt(value || "0", 10) || 0);
    normalised.push(String(v));
    kg += v * parseFloat(String(weights[idx]));
    n += v;
  });
  return { kg: Math.round(kg).toLocaleString("en-US"), n: n.toLocaleString("en-US"), normalised };
}

function originalStep(value: string, step: string): number {
  return Math.max(0, (parseInt(value || "0", 10) || 0) + parseInt(step, 10));
}

function newCalc(values: string[]): { kg: string; n: string; normalised: string[] } {
  const normalised = values.map((v) => String(parseQuantity(v)));
  const result = estimate(estimatorItems.map((item, i) => ({ kg: item.kg, quantity: parseQuantity(values[i]) })));
  return { kg: formatInteger(result.kg), n: formatInteger(result.count), normalised };
}

const weights = estimatorItems.map((i) => i.kg);

describe("e-waste estimator", () => {
  it("keeps the original item weights and default quantities", () => {
    expect(estimatorItems.map((i) => [i.label, i.kg, i.initial])).toEqual([
      ["Phones and tablets", 0.2, 40],
      ["Laptops", 2.5, 25],
      ["Desktop computers", 9, 10],
      ["Monitors and TVs", 6, 10],
      ["Printers", 8, 3],
      ["Solar batteries and UPS units", 7, 2],
    ]);
  });

  it("produces the original result for the default quantities (259 kg from 90 items)", () => {
    const defaults = estimatorItems.map((i) => String(i.initial));
    expect(newCalc(defaults)).toEqual(originalCalc(defaults, weights));
    expect(newCalc(defaults)).toMatchObject({ kg: "259", n: "90" });
  });

  it("normalises odd input exactly like the original", () => {
    const odd = ["", "-3", "abc", "2.7", "007", "1e3"];
    expect(newCalc(odd)).toEqual(originalCalc(odd, weights));
  });

  it("matches the original for 2,000 random quantity combinations", () => {
    let seed = 42;
    const rand = (max: number): number => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed % max;
    };
    for (let run = 0; run < 2000; run++) {
      const values = estimatorItems.map(() => String(rand(5000)));
      expect(newCalc(values)).toEqual(originalCalc(values, weights));
    }
  });

  it("formats large totals with thousands separators", () => {
    const values = ["10000", "10000", "0", "0", "0", "0"];
    expect(newCalc(values)).toEqual(originalCalc(values, weights));
    expect(newCalc(values).kg).toBe("27,000");
  });

  it("steps quantities like the +/- buttons did, never below zero", () => {
    for (const [value, step] of [
      ["0", "-1"],
      ["", "1"],
      ["5", "-1"],
      ["abc", "1"],
      ["-4", "1"],
    ] as const) {
      expect(stepQuantity(value, parseInt(step, 10))).toBe(originalStep(value, step));
    }
  });
});
