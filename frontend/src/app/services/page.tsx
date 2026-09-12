import type { Metadata } from "next";
import Link from "next/link";
import { ServiceSection } from "@/components/sections/ServiceSection";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { heroPhotos, services } from "@/data/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "E-waste management, online safety and cybersecurity training, engineering and ICT consultancy, and applied research from CyberGreen in Kampala, Uganda.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="What CyberGreen does"
        intro="Four service areas, delivered by one multidisciplinary team - so the same engineers who wipe your retired hardware can also train the staff who use its replacement."
        photo={heroPhotos.services}
      >
        {/* In-page jump list, matching the anchors on each section below. */}
        <nav aria-label="Service areas" className="mt-10">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`#${service.slug}`}
                  className="hover:text-circuit hover:decoration-circuit text-sm text-white/70 underline decoration-white/30 underline-offset-4 transition-colors"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {services.map((service, index) => (
        <ServiceSection
          key={service.slug}
          service={service}
          alternate={index % 2 === 1}
        />
      ))}

      <CTASection
        title="Tell us what your institution needs"
        body="Schools, ministries, NGOs, banks and businesses all reach us the same way. Describe the problem and we will tell you honestly whether we are the right people for it."
        primary={{ label: "Make an inquiry", href: "/contact" }}
      />
    </>
  );
}
