"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { cn, formatStatValue } from "@/lib/utils";
import type { Stat as StatData } from "@/data/content";

interface StatProps extends StatData {
  tone?: "dark" | "light" | "hazard";
  className?: string;
}

/**
 * A big number with a small label. This is the ONLY treatment used for
 * figures anywhere on the site - homepage e-waste numbers, impact goals and
 * the Resources hazard stats all render through it, so the animation and
 * typography stay identical rather than being reinvented per section.
 *
 * The value counts up from zero the first time it scrolls into view. The
 * count is written straight to the DOM node rather than through React state:
 * a sixty-frame animation should not trigger sixty renders. The server-
 * rendered markup already contains the final value, so the figure is correct
 * before hydration and for anyone without JavaScript.
 */
export function Stat({
  value,
  prefix,
  suffix,
  decimals = 0,
  label,
  detail,
  tone = "dark",
  className,
}: StatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduceMotion) return;

    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (latest) => {
        node.textContent = formatStatValue(latest, decimals);
      },
    });

    return () => controls.stop();
  }, [inView, reduceMotion, value, decimals]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p
        className={cn(
          "font-display text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl",
          tone === "light" && "text-white",
          tone === "dark" && "text-canopy",
          tone === "hazard" && "text-hazard",
        )}
      >
        {prefix}
        <span ref={ref}>{formatStatValue(value, decimals)}</span>
        {suffix}
      </p>
      <p
        className={cn(
          "text-sm font-medium",
          tone === "light" ? "text-circuit" : "text-signal",
        )}
      >
        {label}
      </p>
      {detail ? (
        <p
          className={cn(
            "text-sm leading-relaxed",
            tone === "light" ? "text-white/70" : "text-ink-600",
          )}
        >
          {detail}
        </p>
      ) : null}
    </div>
  );
}
