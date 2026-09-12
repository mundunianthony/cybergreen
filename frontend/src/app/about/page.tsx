import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { CoreValues } from "@/components/sections/CoreValues";
import { Leadership } from "@/components/sections/Leadership";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import {
  aboutParagraphs,
  challenges,
  corePurposePoints,
  corePurposeStatement,
  cybercrimeStat,
  heroPhotos,
  mission,
  vision,
  whyChooseUs,
} from "@/data/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "CyberGreen Engineering Solutions Co. Ltd - our vision, mission, core values, the challenges we address in Uganda, and the team that leads the work.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Engineering for a greener, safer Uganda"
        photo={heroPhotos.about}
      >
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-x-16">
          {aboutParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="measure leading-relaxed text-white/75"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </PageHero>

      {/* Vision & mission - official statements, quoted verbatim */}
      <section className="py-20 sm:py-24">
        <Container>
          {/* items-start so the shorter vision block is not stretched to
              match the mission's height, which leaves a dead gap beneath it. */}
          <div className="grid items-start gap-10 sm:grid-cols-2 sm:gap-12">
            <div className="border-signal border-l-2 pl-6">
              <h2 className="font-display text-signal text-sm font-semibold tracking-wide">
                Our vision
              </h2>
              <p className="font-display text-canopy mt-4 text-2xl leading-snug sm:text-3xl">
                {vision}
              </p>
            </div>
            <div className="border-circuit border-l-2 pl-6">
              <h2 className="font-display text-circuit text-sm font-semibold tracking-wide">
                Our mission
              </h2>
              <p className="font-display text-canopy mt-4 text-2xl leading-snug sm:text-3xl">
                {mission}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Core purpose */}
      <section className="border-surface-200 border-y bg-white py-20 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <SectionHeading
              title="Our core purpose"
              intro={corePurposeStatement}
            />
            <div>
              <h3 className="font-display text-canopy text-sm font-semibold">
                CyberGreen exists to:
              </h3>
              <ul className="mt-5 space-y-3">
                {corePurposePoints.map((point) => (
                  <li key={point} className="flex gap-3 leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="bg-circuit mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    />
                    <span className="text-ink-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Challenges addressed */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            title="The challenges we address"
            intro="Two pressures growing at the same time, on the same communities."
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
            {challenges.map((challenge) => (
              <div key={challenge.title}>
                <Icon name={challenge.icon} className="text-signal h-7 w-7" />
                <h3 className="font-display text-canopy mt-4 text-2xl font-semibold">
                  {challenge.title}
                </h3>
                <p className="measure text-ink-600 mt-3 leading-relaxed">
                  {challenge.intro}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {challenge.items.map((item) => (
                    <li
                      key={item}
                      className="border-surface-200 text-ink-600 rounded-full border bg-white px-3.5 py-1.5 text-sm"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <figure className="border-hazard mt-14 border-l-2 bg-white px-6 py-8 sm:px-10">
            <blockquote>
              <p className="font-display text-canopy max-w-3xl text-2xl leading-snug sm:text-3xl">
                {cybercrimeStat.quote}
              </p>
            </blockquote>
          </figure>
        </Container>
      </section>

      <CoreValues />
      <Leadership />

      {/* Why choose CyberGreen - a checklist, not another card grid */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading title="Why choose CyberGreen" />
          <ul className="mt-10 grid gap-x-12 gap-y-4 sm:grid-cols-2">
            {whyChooseUs.map((reason) => (
              <li key={reason} className="flex items-start gap-3">
                <Check
                  className="text-signal mt-1 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-ink-600">{reason}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CTASection
        title="Work with a team that does both halves"
        body="Sustainable e-waste handling and practical digital safety, from one Ugandan engineering company."
        primary={{ label: "Contact CyberGreen", href: "/contact" }}
        secondary={{ label: "See our services", href: "/services" }}
      />
    </>
  );
}
