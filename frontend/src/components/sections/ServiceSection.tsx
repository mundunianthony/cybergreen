import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { photos, type ServiceArea } from "@/data/content";

interface ServiceSectionProps {
  service: ServiceArea;
  /** Alternating ground colour keeps the full-bleed rows distinguishable. */
  alternate?: boolean;
}

/**
 * One service area as a full-bleed row: summary on the left, lists on the
 * right. Used for all four areas, so adding a fifth needs only a data entry.
 */
export function ServiceSection({ service, alternate }: ServiceSectionProps) {
  return (
    <section
      id={service.slug}
      aria-labelledby={`${service.slug}-heading`}
      className={cn(
        "border-surface-200 scroll-mt-24 border-b py-16 sm:py-20",
        alternate ? "bg-white" : "bg-surface",
      )}
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Icon name={service.icon} className="text-signal h-8 w-8" />
            <h2
              id={`${service.slug}-heading`}
              className="font-display text-canopy mt-4 text-3xl font-semibold tracking-tight"
            >
              {service.name}
            </h2>
            <p className="measure text-ink-600 mt-4 leading-relaxed">
              {service.summary}
            </p>

            {service.photo ? (
              <Image
                src={photos[service.photo].src}
                alt={photos[service.photo].alt}
                width={800}
                height={500}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="rounded-card mt-8 h-52 w-full object-cover"
              />
            ) : null}
          </div>

          <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
            <div>
              <h3 className="font-display text-canopy text-sm font-semibold">
                {service.itemsLabel}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="text-ink-600 flex gap-3 text-sm leading-relaxed"
                  >
                    <span
                      aria-hidden="true"
                      className="bg-signal mt-2 h-1 w-1 shrink-0 rounded-full"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {service.benefits ? (
              <div>
                <h3 className="font-display text-canopy text-sm font-semibold">
                  Benefits
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {service.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="text-ink-600 flex gap-3 text-sm leading-relaxed"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-circuit mt-2 h-1 w-1 shrink-0 rounded-full"
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
