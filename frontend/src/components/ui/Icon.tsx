import {
  Cpu,
  FlaskConical,
  GraduationCap,
  Heart,
  Leaf,
  Lightbulb,
  Lock,
  Recycle,
  Scale,
  Shield,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/data/content";

/**
 * Maps the icon names used in data/content.ts to lucide components, so the
 * content file stays free of imports and JSX.
 */
const icons: Record<IconName, LucideIcon> = {
  recycle: Recycle,
  shield: Shield,
  cpu: Cpu,
  flask: FlaskConical,
  leaf: Leaf,
  lock: Lock,
  users: Users,
  lightbulb: Lightbulb,
  scale: Scale,
  graduation: GraduationCap,
  heart: Heart,
  sprout: Sprout,
};

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const Component = icons[name];
  return <Component className={className} aria-hidden="true" />;
}
