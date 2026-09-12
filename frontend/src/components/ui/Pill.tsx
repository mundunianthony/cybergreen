import { cn } from "@/lib/utils";

interface PillProps {
  children: React.ReactNode;
  tone?: "default" | "light" | "accent";
  className?: string;
}

/** Small tag used for client lists, expertise areas and hashtags. */
export function Pill({ children, tone = "default", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1.5 text-sm",
        tone === "default" && "bg-surface-200 text-ink",
        tone === "light" && "border border-white/20 bg-white/5 text-white/90",
        tone === "accent" && "border-circuit/40 text-circuit border",
        className,
      )}
    >
      {children}
    </span>
  );
}
