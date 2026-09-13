import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stat } from "@/components/ui/Stat";
import { Icon } from "@/components/ui/Icon";
import { ArrowUpRight } from "lucide-react";
import { TipColumns } from "@/components/sections/TipColumns";
import { PosterCard } from "@/components/sections/PosterCard";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import {
  environmentalImpacts,
  externalResources,
  ewasteStats,
  fastestGrowingStreams,
  healthImpacts,
  heroPhotos,
  posters,
  safetyBasics,
  techSuperpowers,
  trainings,
  whatYouCanDo,
} from "@/data/content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "A public digital safety and e-waste awareness hub: online safety basics, guidance for youth, parents and schools, Uganda e-waste statistics, and free downloadable posters.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        title="Learn it, teach it, pass it on"
        intro="Everything on this page is free to use in a classroom, a staff meeting or at home, with links to the primary sources behind the figures."
        photo={heroPhotos.resources}
      />

      {/* Tech superpowers and safety basics - two halves of the same idea */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-canopy text-2xl font-semibold sm:text-3xl">
                Tech superpowers
              </h2>
              <p className="measure text-ink-600 mt-3 leading-relaxed">
                What going online makes possible when it goes well.
              </p>
              <ul className="mt-8 space-y-5">
                {techSuperpowers.map((item, index) => (
                  <li key={item.title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="font-display text-signal text-sm tabular-nums"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="text-canopy block font-medium">
                        {item.title}
                      </span>
                      <span className="text-ink-600 mt-1 block text-sm leading-relaxed">
                        {item.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-canopy text-2xl font-semibold sm:text-3xl">
                Online safety basics
              </h2>
              <p className="measure text-ink-600 mt-3 leading-relaxed">
                Four habits that prevent most of the harm we see.
              </p>
              <ul className="mt-8 space-y-5">
                {safetyBasics.map((item, index) => (
                  <li key={item.title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="font-display text-circuit text-sm tabular-nums"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="text-canopy block font-medium">
                        {item.title}
                      </span>
                      <span className="text-ink-600 mt-1 block text-sm leading-relaxed">
                        {item.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <TipColumns />

      {/* E-waste hazards - the only place the hazard colour is used */}
      <section
        id="e-waste-hazards"
        className="border-surface-200 scroll-mt-24 border-b bg-white py-20 sm:py-24"
      >
        <Container>
          <SectionHeading
            title="E-waste hazards"
            intro="Why the electronics in the store room are not a harmless pile of plastic."
          />

          <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {ewasteStats.map((stat) => (
              <li key={stat.label}>
                <Stat tone="hazard" {...stat} />
              </li>
            ))}
          </ul>

          <p className="measure text-ink-600 mt-10 text-sm leading-relaxed">
            {fastestGrowingStreams}
          </p>

          {/* Health impacts */}
          <h3 className="font-display text-canopy mt-16 text-2xl font-semibold">
            Health impacts
          </h3>
          <ul className="border-surface-200 mt-6 border-t">
            {healthImpacts.map((group) => (
              <li
                key={group.group}
                className="border-surface-200 grid gap-2 border-b py-6 sm:grid-cols-[14rem_1fr] sm:gap-8"
              >
                <h4 className="font-display text-hazard text-lg font-semibold">
                  {group.group}
                </h4>
                <ul className="space-y-2">
                  {group.impacts.map((impact) => (
                    <li
                      key={impact}
                      className="text-ink-600 flex gap-3 leading-relaxed"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-hazard mt-2.5 h-1 w-1 shrink-0 rounded-full"
                      />
                      {impact}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {/* Environmental impacts */}
          <h3 className="font-display text-canopy mt-16 text-2xl font-semibold">
            Environmental impacts
          </h3>
          <ul className="mt-6 grid gap-8 sm:grid-cols-2">
            {environmentalImpacts.map((impact) => (
              <li key={impact.title} className="border-hazard border-l-2 pl-5">
                <h4 className="text-canopy font-medium">{impact.title}</h4>
                <p className="text-ink-600 mt-2 text-sm leading-relaxed">
                  {impact.detail}
                </p>
              </li>
            ))}
          </ul>

          {/* What you can do */}
          <h3 className="font-display text-canopy mt-16 text-2xl font-semibold">
            What you can do
          </h3>
          <ol className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whatYouCanDo.map((action, index) => (
              <li key={action.title}>
                <span
                  aria-hidden="true"
                  className="font-display text-signal text-sm tabular-nums"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h4 className="text-canopy mt-2 font-medium">{action.title}</h4>
                <p className="text-ink-600 mt-2 text-sm leading-relaxed">
                  {action.detail}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Downloadable posters */}
      <section id="posters" className="scroll-mt-24 py-20 sm:py-24">
        <Container>
          <SectionHeading
            title="Our awareness posters"
            intro="Three awareness posters for classroom walls, staff noticeboards and community meetings. Printable versions are on the way - contact us if you need one sooner."
          />
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posters.map((poster) => (
              <li key={poster.file} className="flex">
                <PosterCard poster={poster} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Further reading - verified primary sources */}
      <section className="border-surface-200 border-t py-20 sm:py-24">
        <Container>
          <SectionHeading
            title="Further reading"
            intro="The primary sources behind the figures above, and the Ugandan authorities responsible for e-waste and online safety."
          />
          <ul className="border-surface-200 mt-10 border-t">
            {externalResources.map((resource) => (
              <li key={resource.href} className="border-surface-200 border-b">
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-2 py-6 transition-colors sm:grid-cols-[18rem_1fr] sm:gap-8"
                >
                  <div>
                    <h3 className="font-display text-canopy group-hover:text-signal inline-flex items-start gap-1.5 text-lg font-semibold transition-colors">
                      {resource.title}
                      <ArrowUpRight
                        className="mt-1 h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                    </h3>
                    <p className="text-signal mt-1 text-sm">
                      {resource.publisher}
                    </p>
                  </div>
                  <p className="text-ink-600 text-sm leading-relaxed">
                    {resource.description}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Trainings offered */}
      <section className="border-surface-200 border-t bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading
            title="Trainings CyberGreen offers"
            intro="Prefer this delivered in person? These are the formats we run."
          />
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trainings.map((training) => (
              <li key={training.name}>
                <Icon name={training.icon} className="text-signal h-6 w-6" />
                <h3 className="font-display text-canopy mt-4 text-lg font-semibold">
                  {training.name}
                </h3>
                <p className="text-ink-600 mt-2 text-sm leading-relaxed">
                  {training.detail}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CTASection
        title="Book a session for your school or team"
        body="Tell us the group, the age range and roughly how many people, and we will propose a format that fits."
        primary={{ label: "Request a training", href: "/contact" }}
      />
    </>
  );
}
