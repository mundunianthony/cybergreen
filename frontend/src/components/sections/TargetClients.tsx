import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Pill } from "@/components/ui/Pill";
import { targetClients } from "@/data/content";

/**
 * A text wall rather than a logo wall - CyberGreen has no client logos to
 * show yet, and inventing placeholder marks would misrepresent the record.
 */
export function TargetClients() {
  return (
    <section className="border-surface-200 border-y py-20 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            title="Who we work with"
            intro="CyberGreen's services are built for institutions and households alike."
          />
          <ul className="flex flex-wrap gap-2.5 lg:pt-3">
            {targetClients.map((client) => (
              <li key={client}>
                <Pill>{client}</Pill>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
