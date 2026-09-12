import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Narrow is for long-form reading columns; wide is the default grid. */
  width?: "default" | "narrow";
}

/**
 * The single horizontal rhythm for the site. Every section uses this rather
 * than repeating max-width and padding values, so the left edge of content
 * lines up from the navbar to the footer.
 */
export function Container({
  children,
  className,
  width = "default",
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        width === "default" ? "max-w-6xl" : "max-w-3xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
