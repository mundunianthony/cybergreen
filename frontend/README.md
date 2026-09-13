# CyberGreen — Frontend

Marketing site for **CyberGreen Engineering Solutions Co. Ltd** (Nakawa, Kampala).
_Safer Digital Lives. Sustainable Futures._

Frontend only. The Django backend does not exist yet — see
[Backend integration](#backend-integration) for the one place that will need
wiring when it does.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (`strict`)
- **Tailwind CSS v4** — CSS-first: design tokens live in an `@theme` block in
  `src/app/globals.css`, not a `tailwind.config.js`
- **Framer Motion** (mobile menu, stat count-ups), **lucide-react** icons
- **clsx** + **tailwind-merge** via a `cn()` helper
- **ESLint 9** + **Prettier** (with `prettier-plugin-tailwindcss` for class order)

All six routes are statically prerendered. Only three components opt into the
client (`Navbar`, `ContactForm`, `Stat`); everything else is a server component.

## Prerequisites

- Node.js 22 (see `.nvmrc`)
- npm — the lockfile is committed; don't add yarn/pnpm lockfiles

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Script                 | Does                             |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Dev server                       |
| `npm run build`        | Production build                 |
| `npm start`            | Serve the production build       |
| `npm run lint`         | ESLint                           |
| `npm run typecheck`    | `tsc --noEmit`                   |
| `npm run format`       | Rewrite with Prettier            |
| `npm run format:check` | Verify formatting (CI runs this) |

## Structure

```
src/
├── app/            / /about /services /resources /contact + not-found
├── components/
│   ├── layout/     Navbar, Footer, Logo
│   ├── sections/   Page sections (Hero, PageHero, ServiceSection, ...)
│   └── ui/         Primitives (Button, Container, SectionHeading, Stat, ...)
├── data/
│   └── content.ts  Single source of truth for all copy, stats, contact details
└── lib/
    └── utils.ts    cn() and stat formatting
```

### Two conventions to preserve

**Content lives in `src/data/content.ts`.** Pages import from it and never
hardcode a phone number, statistic or bullet list. Facts used on more than one
page therefore cannot drift out of sync. Edit copy there, not in JSX.

**Colours, fonts and shared geometry are tokens**, declared once in the
`@theme` block of `globals.css` and consumed as Tailwind classes (`bg-canopy`,
`text-signal`, `font-display`). There are no raw hex values in components.

Typography is **Fraunces** (display) and **Inter** (body/UI), loaded through
`next/font/google` and exposed as `--font-display` / `--font-sans`.

## Images

Photography is served from Unsplash through `next/image`;
`images.unsplash.com` is allowlisted in `next.config.ts`. Sources live in the
`photos` and `heroPhotos` exports in `src/data/content.ts` — swap any `src` for
a local `/images/...` path once CyberGreen's own photography exists.

The three CyberGreen posters on `/resources` are **not in the repo yet**. Their
cards show a stand-in photo and a "Coming soon" label rather than a download
link. See `public/downloads/README.md` for the filenames to drop in.

## Backend integration

`.env.example` documents the only variable the site will need:

```
NEXT_PUBLIC_API_URL=
```

`src/components/sections/ContactForm.tsx` validates fully on the client, then
hands the message to the visitor's mail client via `mailto:`. The
`// TODO: replace with POST to Django backend` comment marks the exact handler
to change.

## Deployment

Deployed on **Vercel** from the `main` branch.

Because the app lives in a subdirectory, two project settings matter:

- **Root Directory** -> `frontend`
- **Framework Preset** -> `Next.js` (not "Other" — with "Other", Vercel skips the
  Next.js runtime, serves no routes, and every path 404s)

Leave Build Command, Output Directory and Install Command on their defaults.
When the Django backend exists, add `NEXT_PUBLIC_API_URL` under the project's
environment variables rather than committing it.

## CI

`.github/workflows/frontend-ci.yml` runs on pull requests and pushes to `main`
touching `frontend/**`: `npm ci` -> lint -> format check -> typecheck -> build.
It does not deploy and needs no secrets.
