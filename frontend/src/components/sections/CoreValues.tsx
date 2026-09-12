import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { coreValues } from "@/data/content";

/**
 * A bordered list rather than five identical icon cards in a row - the same
 * information, without repeating the card grid used elsewhere on the page.
 */
export function CoreValues() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading title="Our core values" />

        <ul className="border-surface-200 mt-10 border-t">
          {coreValues.map((value) => (
            <li
              key={value.name}
              className="border-surface-200 grid gap-2 border-b py-6 sm:grid-cols-[auto_14rem_1fr] sm:items-baseline sm:gap-6"
            >
              <Icon
                name={value.icon}
                className="text-signal h-5 w-5 self-center"
              />
              <h3 className="font-display text-canopy text-xl font-semibold">
                {value.name}
              </h3>
              <p className="text-ink-600 leading-relaxed">
                {value.description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
