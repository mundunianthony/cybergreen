export interface Poster {
  /** File stem in public/assets/posters. Each poster has <slug>.jpg and <slug>_sm.jpg. */
  slug: string;
  title: string;
  alt: string;
}

export const posters = [
  { slug: "01_ewaste_by_the_numbers", title: "41,000 tonnes", alt: "Poster: 41,000 tonnes" },
  { slug: "02_dont_dump_it", title: "Don't dump it", alt: "Poster: Don't dump it" },
  { slug: "03_burning_ewaste", title: "Burning e-waste", alt: "Poster: Burning e-waste" },
  {
    slug: "04_old_phone_remembers",
    title: "Your old phone still remembers",
    alt: "Poster: Your old phone still remembers",
  },
  { slug: "05_retiring_laptops", title: "Retiring old laptops?", alt: "Poster: Retiring old laptops?" },
  { slug: "06_think_before_you_post", title: "Think before you post", alt: "Poster: Think before you post" },
  { slug: "07_ask_your_child", title: "Ask what they did online", alt: "Poster: Ask what they did online" },
  { slug: "08_your_pin_is_yours", title: "Your PIN is yours alone", alt: "Poster: Your PIN is yours alone" },
  { slug: "09_schools_programme", title: "Online safety in schools", alt: "Poster: Online safety in schools" },
] as const satisfies readonly Poster[];

export type PosterSlug = (typeof posters)[number]["slug"];

/** Thumbnail: 540 x 675. Full size: 2160 x 2700 (same 4:5 ratio). */
export const posterSrc = (slug: PosterSlug, size: "sm" | "full" = "full"): string =>
  `/assets/posters/${slug}${size === "sm" ? "_sm" : ""}.jpg`;

export const getPoster = (slug: PosterSlug): (typeof posters)[number] => {
  const poster = posters.find((p) => p.slug === slug);
  if (!poster) throw new Error(`Unknown poster: ${slug}`);
  return poster;
};
