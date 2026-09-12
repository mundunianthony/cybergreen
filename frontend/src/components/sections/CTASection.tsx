import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { company } from "@/data/content";

interface CTASectionProps {
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Show the company tagline above the heading. */
  showTagline?: boolean;
}

/** Closing call-to-action band, reused at the foot of several pages. */
export function CTASection({
  title,
  body,
  primary,
  secondary,
  showTagline = false,
}: CTASectionProps) {
  return (
    <section className="bg-canopy py-16 sm:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            {showTagline ? (
              <p className="font-display text-circuit text-lg">
                {company.tagline}
              </p>
            ) : null}
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            <p className="measure mt-4 leading-relaxed text-white/75">{body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
            {secondary ? (
              <ButtonLink href={secondary.href} variant="ghost">
                {secondary.label}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
