import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Pill } from "@/components/ui/Pill";
import { leadership } from "@/data/content";

/**
 * Name, role, bio and expertise. A component rather than inline markup so a
 * second team member can be added later without duplicating the layout.
 */
export function Leadership() {
  return (
    <section className="bg-canopy py-20 text-white sm:py-24">
      <Container>
        <SectionHeading tone="light" title="Leadership" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <h3 className="font-display text-2xl font-semibold text-white">
              {leadership.name}
            </h3>
            <p className="text-circuit mt-2 text-sm">{leadership.title}</p>
          </div>

          <div>
            {leadership.bio.map((paragraph) => (
              <p
                key={paragraph}
                className="measure mb-4 leading-relaxed text-white/75 last:mb-0"
              >
                {paragraph}
              </p>
            ))}

            <h4 className="font-display mt-10 text-sm font-semibold text-white">
              Areas of expertise
            </h4>
            <ul className="mt-4 flex flex-wrap gap-2">
              {leadership.expertise.map((area) => (
                <li key={area}>
                  <Pill tone="light">{area}</Pill>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
