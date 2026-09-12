import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  /** Optional lead paragraph rendered under the heading. */
  intro?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** Light text for use on canopy/hazard backgrounds. */
  tone?: "dark" | "light";
}

/**
 * Section title plus optional standfirst. Deliberately has no all-caps
 * eyebrow label - the heading itself carries the structure.
 */
export function SectionHeading({
  title,
  intro,
  as: Tag = "h2",
  className,
  tone = "dark",
}: SectionHeadingProps) {
  return (
    <div className={cn("measure", className)}>
      <Tag
        className={cn(
          "font-display font-semibold tracking-tight",
          Tag === "h1"
            ? "text-4xl sm:text-5xl lg:text-6xl"
            : "text-3xl sm:text-4xl",
          tone === "light" ? "text-white" : "text-canopy",
        )}
      >
        {title}
      </Tag>
      {intro ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            tone === "light" ? "text-white/80" : "text-ink-600",
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
