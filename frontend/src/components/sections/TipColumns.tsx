import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { audienceGuidance } from "@/data/content";

/**
 * The audience guidance from the digital-safety poster, given real weight -
 * three columns, each numbered so the tips read as a sequence a reader can
 * work through rather than a decorative grid.
 */
export function TipColumns() {
  return (
    <section
      id="guidance"
      className="bg-canopy scroll-mt-24 py-20 text-white sm:py-24"
    >
      <Container>
        <SectionHeading
          tone="light"
          title="Guidance by audience"
          intro="The same four habits, framed for the three groups who need them most."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-8">
          {audienceGuidance.map((group) => (
            <div
              key={group.audience}
              className="border-circuit flex flex-col border-t-2 pt-6"
            >
              <h3 className="font-display text-xl font-semibold text-white">
                {group.audience}
              </h3>

              <ol className="mt-6 flex-1 space-y-5">
                {group.tips.map((tip, index) => (
                  <li key={tip.title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="font-display text-circuit text-sm tabular-nums"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-medium text-white">
                        {tip.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-white/70">
                        {tip.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <p className="text-circuit mt-8 text-sm">{group.hashtag}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
