import { Hero } from "@/components/sections/Hero";
import { PillarsGrid } from "@/components/sections/PillarsGrid";
import { EwasteNumbers, ImpactGoals } from "@/components/sections/ImpactStats";
import { TargetClients } from "@/components/sections/TargetClients";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { homeIntro } from "@/data/content";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="py-20 sm:py-24">
        <Container width="narrow">
          <p className="font-display text-canopy text-xl leading-relaxed sm:text-2xl">
            {homeIntro}
          </p>
        </Container>
      </section>

      <PillarsGrid />
      <EwasteNumbers />
      <ImpactGoals />
      <TargetClients />

      <CTASection
        showTagline
        title="Let's work together"
        body="Whether you have a store room of dead hardware to clear, a school that needs an online safety programme, or an ICT decision that needs an engineer's judgement - we would like to hear from you."
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "Download our posters", href: "/resources" }}
      />
    </>
  );
}
