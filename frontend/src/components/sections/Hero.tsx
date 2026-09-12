import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { company, hero, heroPhotos } from "@/data/content";

/**
 * The site's single orchestrated animation, played once on first load: the
 * circuit traces draw themselves outward across the leaf, then the headline
 * and supporting copy settle in behind them.
 *
 * Deliberately a server component driven by CSS keyframes rather than a
 * client-side motion library. The copy is therefore present and opaque in the
 * server-rendered HTML - the animation only moves it - so the headline can
 * never be left invisible by a JS failure, and it costs no client JS at all.
 * The keyframes are disabled wholesale by the prefers-reduced-motion block in
 * globals.css.
 *
 * Layout is editorial rather than the centred SaaS default: copy holds the
 * left column, the mark the right, stacking on mobile.
 */
export function Hero() {
  return (
    <section className="bg-canopy relative overflow-hidden">
      <Image
        src={heroPhotos.home.src}
        alt={heroPhotos.home.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div
        aria-hidden="true"
        className="from-canopy via-canopy/90 to-canopy/50 absolute inset-0 bg-gradient-to-r"
      />

      <Container className="relative">
        <div className="grid items-center gap-12 py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-28">
          <div>
            <p className="font-display animate-rise text-circuit text-lg [animation-delay:900ms]">
              {company.registeredName}
            </p>

            <h1 className="font-display animate-rise mt-5 text-4xl leading-[1.08] font-semibold tracking-tight text-white [animation-delay:1050ms] sm:text-5xl lg:text-6xl">
              {hero.headline}
            </h1>

            <p className="measure animate-rise mt-6 text-base leading-relaxed text-white/75 [animation-delay:1200ms] sm:text-lg">
              {hero.supporting}
            </p>

            <div className="animate-rise mt-9 flex flex-col gap-3 [animation-delay:1350ms] sm:flex-row">
              <ButtonLink href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={hero.secondaryCta.href} variant="ghost">
                {hero.secondaryCta.label}
              </ButtonLink>
            </div>
          </div>

          <CircuitLeaf />
        </div>
      </Container>
    </section>
  );
}

/**
 * The logo mark enlarged: a leaf whose veins are circuit traces. Each trace
 * is drawn with a dash pattern equal to its own length and animated from
 * fully offset to zero, so the lines appear to grow outward from the stem.
 */
function CircuitLeaf() {
  // Traces run from the midrib outward; nodes terminate them.
  const traces = [
    { d: "M52 188 C 92 150, 128 104, 160 52", length: 190 },
    { d: "M96 140 L 148 128", length: 54 },
    { d: "M120 108 L 126 66", length: 43 },
    { d: "M76 160 L 62 118", length: 45 },
    { d: "M140 78 L 178 84", length: 39 },
  ];

  const nodes = [
    { cx: 148, cy: 128 },
    { cx: 126, cy: 66 },
    { cx: 62, cy: 118 },
    { cx: 178, cy: 84 },
  ];

  return (
    <div className="mx-auto w-full max-w-sm lg:max-w-none">
      <svg
        viewBox="0 0 220 220"
        className="h-auto w-full"
        role="img"
        aria-label="Illustration of a leaf whose veins are drawn as circuit board traces"
      >
        {/*
          A leaf: two mirrored curves meeting at tip and stem, plus the
          midrib the traces branch from.
        */}
        <path
          d="M52 188 C 40 120, 78 44, 168 34 C 178 118, 130 178, 52 188 Z"
          className="fill-signal/15 stroke-signal animate-draw-leaf [stroke-dasharray:420] [stroke-dashoffset:420]"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {traces.map((trace, index) => (
          <path
            key={trace.d}
            d={trace.d}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            className="stroke-circuit animate-draw-trace"
            style={{
              // Per-path dash length: the only value that cannot live in a
              // utility class, because it is the measured path length.
              strokeDasharray: trace.length,
              strokeDashoffset: trace.length,
              animationDelay: `${750 + index * 100}ms`,
            }}
          />
        ))}

        {nodes.map((node, index) => (
          <circle
            key={`${node.cx}-${node.cy}`}
            cx={node.cx}
            cy={node.cy}
            r="5"
            className="fill-circuit animate-pop"
            style={{
              transformOrigin: `${node.cx}px ${node.cy}px`,
              animationDelay: `${1150 + index * 100}ms`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
