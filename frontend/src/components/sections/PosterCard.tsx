import Image from "next/image";
import { Download } from "lucide-react";
import { photos, type Poster } from "@/data/content";

/**
 * A poster card. The real artwork is not in the repo yet, so this shows a
 * stand-in photo and a "Coming soon" label rather than a link that would 404.
 * See public/downloads/README.md to swap in the real files.
 */
export function PosterCard({ poster }: { poster: Poster }) {
  const photo = photos[poster.previewPhoto];

  return (
    <figure className="rounded-card border-surface-200 flex flex-col overflow-hidden border bg-white">
      <div className="border-surface-200 relative h-44 border-b">
        <Image
          src={photo.src}
          alt={poster.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <figcaption className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-canopy text-lg leading-snug font-semibold">
          {poster.title}
        </h3>
        <p className="text-ink-600 mt-3 flex-1 text-sm leading-relaxed">
          {poster.description}
        </p>
        <p className="text-ink-600 mt-5 inline-flex items-center gap-2 text-sm font-medium">
          <Download className="h-4 w-4" aria-hidden="true" />
          Coming soon
          <span className="sr-only">: printable version of {poster.title}</span>
        </p>
      </figcaption>
    </figure>
  );
}
