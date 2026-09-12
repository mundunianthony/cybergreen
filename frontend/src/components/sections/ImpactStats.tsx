import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stat } from "@/components/ui/Stat";
import {
  headlineEwasteStats,
  impactGoalStatement,
  impactGoalStats,
} from "@/data/content";

/** The "why this matters" band - Uganda's e-waste gap, in figures. */
export function EwasteNumbers() {
  return (
    <section className="bg-canopy py-20 text-white sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            tone="light"
            title="Uganda threw away 41,000 tonnes of electronics in one year"
            intro="Almost none of it was recovered. The rest went to dumpsites, informal burning, or straight into the ground - taking the data still stored on it along too."
          />

          <ul className="grid gap-10 sm:grid-cols-3 lg:gap-8">
            {headlineEwasteStats.map((stat) => (
              <li key={stat.label}>
                <Stat tone="light" {...stat} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/** What CyberGreen is working toward - stated as goals, not achievements. */
export function ImpactGoals() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          title="What we are working toward"
          intro="Targets CyberGreen has set for its initial years of operation."
        />

        <div className="border-surface-200 mt-12 grid gap-10 border-t pt-10 sm:grid-cols-3">
          {impactGoalStats.map((stat) => (
            <Stat key={stat.label} {...stat} />
          ))}

          <div className="flex flex-col gap-2">
            <p className="font-display text-canopy text-4xl font-semibold tracking-tight sm:text-5xl">
              Schools
            </p>
            <p className="text-signal text-sm font-medium">
              {impactGoalStatement.title}
            </p>
            <p className="text-ink-600 text-sm leading-relaxed">
              {impactGoalStatement.detail}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
