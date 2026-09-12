import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center rounded-card px-6 py-3 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-signal text-white hover:bg-signal-700",
  secondary:
    "border border-canopy/25 bg-transparent text-canopy hover:border-canopy hover:bg-canopy hover:text-white",
  // For use on dark (canopy) grounds, where the bordered secondary would vanish.
  ghost:
    "border border-white/30 bg-transparent text-white hover:border-circuit hover:text-circuit",
};

interface ButtonAsLink {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

/** Navigational call to action. Renders a real anchor for accessibility. */
export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: ButtonAsLink) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

/** Action button - used by the contact form. */
export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}
