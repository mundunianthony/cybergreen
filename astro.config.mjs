// @ts-check
import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // Production origin. Used for canonical URLs, absolute Open Graph image URLs and the sitemap.
  site: "https://www.cybergreen.co.ug",
  trailingSlash: "never",
  build: {
    // Emit about.html, e-waste.html, ... so the original file names keep existing.
    // vercel.json `cleanUrls` serves them at /about, /e-waste, ... and 308-redirects the .html URLs.
    format: "file",
  },
  integrations: [sitemap()],
  env: {
    schema: {
      // Formspree form IDs (or full https://formspree.io/f/<id> URLs). Public by design:
      // Formspree endpoints are always visible in the page. Optional: without them the forms
      // fall back to the original "prepare message, send by WhatsApp or email" behaviour.
      PUBLIC_FORMSPREE_CONTACT_ID: envField.string({ context: "client", access: "public", optional: true }),
      PUBLIC_FORMSPREE_PICKUP_ID: envField.string({ context: "client", access: "public", optional: true }),
    },
  },
});
