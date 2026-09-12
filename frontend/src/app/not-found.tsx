import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { navLinks } from "@/data/content";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="bg-canopy py-24 text-white sm:py-32">
      <Container width="narrow">
        <p className="font-display text-circuit text-lg">404</p>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          This page has been recycled
        </h1>
        <p className="measure mt-5 leading-relaxed text-white/75">
          The link you followed does not lead anywhere on this site. It may have
          moved, or the address may have a typo in it.
        </p>

        <div className="mt-9">
          <ButtonLink href="/">Back to the homepage</ButtonLink>
        </div>

        <nav
          aria-label="Site sections"
          className="mt-12 border-t border-white/15 pt-8"
        >
          <h2 className="text-sm font-medium text-white">
            Or try one of these
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
            {navLinks
              .filter((link) => link.href !== "/")
              .map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-circuit hover:decoration-circuit text-sm text-white/70 underline decoration-white/30 underline-offset-4 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
