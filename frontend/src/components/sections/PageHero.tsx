import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { heroPhotos } from "@/data/content";

interface PageHeroProps {
  title: string;
  intro?: string;
  photo: (typeof heroPhotos)[keyof typeof heroPhotos];
  children?: React.ReactNode;
}

/**
 * The dark page-header band used at the top of About, Services, Resources
 * and Contact - a full-bleed photo under a canopy gradient, replacing a flat
 * green fill so each page opens with a real image instead of a solid colour.
 */
export function PageHero({ title, intro, photo, children }: PageHeroProps) {
  return (
    <section className="bg-canopy relative overflow-hidden py-16 text-white sm:py-20">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div
        aria-hidden="true"
        className="from-canopy via-canopy/85 to-canopy/50 absolute inset-0 bg-gradient-to-t"
      />

      <Container className="relative">
        <SectionHeading as="h1" tone="light" title={title} intro={intro} />
        {children}
      </Container>
    </section>
  );
}
