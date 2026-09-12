import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { services } from "@/data/content";

/**
 * The four service areas as parallel offerings - not numbered, because none
 * precedes another. Each card deep-links to its anchor on /services.
 */
export function PillarsGrid() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          title="Four ways we work"
          intro="From the lorry that collects your old servers to the classroom session that teaches a fourteen-year-old to spot a phishing message."
        />

        <ul className="rounded-card bg-surface-200 mt-12 grid gap-px overflow-hidden sm:grid-cols-2">
          {services.map((service) => (
            <li key={service.slug} className="bg-surface">
              <Link
                href={`/services#${service.slug}`}
                className="group flex h-full flex-col gap-4 p-7 transition-colors hover:bg-white sm:p-8"
              >
                <Icon
                  name={service.icon}
                  className="text-signal group-hover:text-circuit h-7 w-7 transition-colors"
                />
                <h3 className="font-display text-canopy text-xl font-semibold">
                  {service.name}
                </h3>
                <p className="text-ink-600 text-sm leading-relaxed">
                  {service.pillarSummary}
                </p>
                <span className="text-signal mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-medium">
                  See what this includes
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
