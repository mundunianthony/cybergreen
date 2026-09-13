import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { company, contact, hashtags, navLinks, services } from "@/data/content";

export function Footer() {
  return (
    <footer className="bg-canopy mt-auto text-white/80">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              {company.tagline}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-display text-sm font-semibold text-white">
              Site
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-circuit transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-sm font-semibold text-white">
              Services
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services#${service.slug}`}
                    className="hover:text-circuit transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <address className="not-italic">
            <h2 className="font-display text-sm font-semibold text-white">
              Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2.5">
                <MapPin
                  className="text-circuit mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                <span>
                  {contact.addressLine}
                  <br />
                  {contact.city}
                  <br />
                  {contact.poBox}
                </span>
              </li>
              <li className="flex gap-2.5">
                <Phone
                  className="text-circuit mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={contact.phoneHref}
                  className="hover:text-circuit transition-colors"
                >
                  {contact.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail
                  className="text-circuit mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-circuit break-all transition-colors"
                >
                  {contact.email}
                </a>
              </li>
            </ul>
          </address>
        </div>

        <div className="border-t border-white/10 py-6">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/70">
            {hashtags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-2 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {new Date().getFullYear()} {company.registeredName}. All
              rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href={contact.websiteHref}
                className="hover:text-circuit transition-colors"
              >
                {contact.website}
              </a>
              <a
                href={contact.social.href}
                className="hover:text-circuit transition-colors"
              >
                {contact.social.platform} {contact.social.label}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
