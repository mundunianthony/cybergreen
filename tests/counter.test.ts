import { describe, expect, it } from "vitest";
import { decimalsOf, easeOutCubic, formatCount } from "../src/lib/counter";

/** Reference: fmt() from the original count-up. */
function originalFmt(raw: string, pre: string, v: number): string {
  const dec = (raw.split(".")[1] || "").length;
  return pre + v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

describe("animated counters", () => {
  it("formats final values exactly like the original", () => {
    for (const [raw, pre] of [
      ["41000", ""],
      ["200", ""],
      ["72", "UGX "],
      ["40", ""],
      ["2.5", ""],
    ] as const) {
      expect(formatCount(parseFloat(raw), decimalsOf(raw), pre)).toBe(originalFmt(raw, pre, parseFloat(raw)));
    }
    expect(formatCount(41000, 0)).toBe("41,000");
    expect(formatCount(72, 0, "UGX ")).toBe("UGX 72");
  });

  it("formats intermediate frames the same way", () => {
    for (let p = 0; p <= 1; p += 0.05) {
      const v = 41000 * easeOutCubic(p);
      expect(formatCount(v, 0)).toBe(originalFmt("41000", "", v));
    }
  });

  it("eases from 0 to 1 with the original cubic curve", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeCloseTo(1 - Math.pow(0.5, 3));
  });
});
