import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  tone?: "dark" | "light";
}

/**
 * The CyberGreen mark, drawn inline as SVG: a leaf whose veins are circuit
 * traces with terminating nodes. Inline rather than an image file so it
 * inherits currentColor, stays crisp at any size, and can share its path with
 * the hero's line-drawing animation.
 */
export function Logo({ className, tone = "dark" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 40 40"
        className="h-9 w-9 shrink-0"
        role="img"
        aria-label="CyberGreen logo"
      >
        <path
          d="M32 6C18 6 8 13 8 24c0 4 1.6 7.4 4 9.6C14.4 30 20 22 32 6Z"
          className={tone === "light" ? "fill-signal/25" : "fill-signal/15"}
        />
        <path
          d="M32 6C18 6 8 13 8 24c0 4 1.6 7.4 4 9.6C14.4 30 20 22 32 6Z"
          fill="none"
          strokeWidth="2"
          className={tone === "light" ? "stroke-white" : "stroke-canopy"}
        />
        <path
          d="M12 33.6 24 15M18.4 24.6h6.2M15.6 28.8h3.4"
          fill="none"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="stroke-circuit"
        />
        <circle cx="24.6" cy="24.6" r="2" className="fill-circuit" />
        <circle cx="19.2" cy="28.8" r="1.6" className="fill-circuit" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            tone === "light" ? "text-white" : "text-canopy",
          )}
        >
          Cyber
          {/* On the dark nav the mid-green sits too close to the canopy
              ground to read, so the lighter tint carries it there. */}
          <span
            className={tone === "light" ? "text-signal-300" : "text-signal"}
          >
            Green
          </span>
        </span>
        <span
          className={cn(
            "mt-1 text-[0.625rem] tracking-wide",
            tone === "light" ? "text-white/75" : "text-ink-600",
          )}
        >
          Engineering Solutions
        </span>
      </span>
    </span>
  );
}
