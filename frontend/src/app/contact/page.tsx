import type { Metadata } from "next";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { contact, contactSubjects, heroPhotos } from "@/data/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach CyberGreen Engineering Solutions Co. Ltd in Nakawa, Kampala - for e-waste pickup, training requests, consultancy or general enquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Get in touch"
        intro="Tell us what you need and we will come back to you. If it is urgent, calling is fastest."
        photo={heroPhotos.contact}
      />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <h2 className="font-display text-canopy text-2xl font-semibold">
                Send us a message
              </h2>
              <p className="measure text-ink-600 mt-3 leading-relaxed">
                Pick the closest reason below - it helps your message reach the
                right person on the team.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            <div>
              <h2 className="font-display text-canopy text-2xl font-semibold">
                Head office
              </h2>

              <address className="mt-6 not-italic">
                <ul className="space-y-5">
                  <li className="flex gap-3.5">
                    <MapPin
                      className="text-signal mt-0.5 h-5 w-5 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-ink-600 leading-relaxed">
                      <span className="text-canopy block font-medium">
                        Visit us
                      </span>
                      {contact.addressLine}
                      <br />
                      {contact.city}
                      <br />
                      {contact.poBox}
                    </span>
                  </li>

                  <li className="flex gap-3.5">
                    <Phone
                      className="text-signal mt-0.5 h-5 w-5 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-ink-600">
                      <span className="text-canopy block font-medium">
                        Call us
                      </span>
                      <a
                        href={contact.phoneHref}
                        className="hover:text-signal transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </span>
                  </li>

                  <li className="flex gap-3.5">
                    <Mail
                      className="text-signal mt-0.5 h-5 w-5 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-ink-600">
                      <span className="text-canopy block font-medium">
                        Email us
                      </span>
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:text-signal break-all transition-colors"
                      >
                        {contact.email}
                      </a>
                    </span>
                  </li>

                  <li className="flex gap-3.5">
                    <Globe
                      className="text-signal mt-0.5 h-5 w-5 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-ink-600">
                      <span className="text-canopy block font-medium">
                        Online
                      </span>
                      <a
                        href={contact.websiteHref}
                        className="hover:text-signal block transition-colors"
                      >
                        {contact.website}
                      </a>
                      <a
                        href={contact.social.href}
                        className="hover:text-signal block transition-colors"
                      >
                        {contact.social.platform} {contact.social.label}
                      </a>
                    </span>
                  </li>
                </ul>
              </address>

              {/*
                A written location note rather than a Google Maps embed - no
                API key has been supplied, and an unkeyed embed would render
                as an error tile.
              */}
              <div className="rounded-card border-surface-200 mt-10 border bg-white p-6">
                <h3 className="font-display text-canopy text-lg font-semibold">
                  Finding us
                </h3>
                <p className="text-ink-600 mt-2 text-sm leading-relaxed">
                  We are on {contact.addressLine}, in {contact.city}. Call ahead
                  on {contact.phone} and we will guide you in.
                </p>
              </div>

              <div className="mt-10">
                <h3 className="font-display text-canopy text-lg font-semibold">
                  What people contact us about
                </h3>
                <ul className="mt-4 space-y-2">
                  {contactSubjects.map((subject) => (
                    <li
                      key={subject}
                      className="text-ink-600 flex gap-3 text-sm"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-circuit mt-2 h-1 w-1 shrink-0 rounded-full"
                      />
                      {subject}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
