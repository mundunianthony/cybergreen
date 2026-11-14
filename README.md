# CyberGreen website

The CyberGreen Engineering Solutions website, built with [Astro](https://astro.build) and TypeScript as a fully
static site, deployed on Vercel. The contact and pickup forms submit through [Formspree](https://formspree.io), and the
original "send it on WhatsApp or by email" options are kept.

This project replaces the original hand-written HTML site. That site is kept unchanged in `../cybergreen-original`
for reference; the verification scripts compare against it.

## Requirements

- Node.js 22.23.4 or newer (required by Astro 7)
- npm

## Getting started

```sh
npm install
cp .env.example .env    # optional: add Formspree form IDs (see below)
npm run dev             # http://localhost:4321
```

## Scripts

| Command            | What it does                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `npm run dev`      | Development server with hot reload                                                                                 |
| `npm run build`    | Static build into `dist/`                                                                                          |
| `npm run preview`  | Serve the built `dist/` locally                                                                                    |
| `npm run check`    | Type-check `.astro` and `.ts` files (`astro check`)                                                                |
| `npm run format`   | Format everything with Prettier (`format:check` to verify only)                                                    |
| `npm test`         | Unit tests (Vitest): estimator, message builder, counters, Formspree client                                        |
| `npm run verify`   | After a build: checks every link, anchor and asset in `dist/`, and content parity with the original site           |
| `npm run test:e2e` | Browser tests (Playwright, uses the installed Microsoft Edge), including a pixel comparison with the original site |
| `npm run validate` | `format:check` + `check` + `test` + `build` + `verify`                                                             |

Browser tests use Microsoft Edge by default. Set `PW_CHANNEL=chrome` to use Chrome, or run
`npx playwright install chromium` and set `PW_CHANNEL=bundled` (for example on CI).

> **Windows note:** run the test commands from a terminal whose current directory uses an upper-case drive letter
> (`D:\projects\cybergreen`). Vitest loads its runner twice when the path is `d:\...`, and every suite then fails with
> `Cannot read properties of undefined (reading 'config')`.

## Environment variables

| Variable                      | Required | Purpose                                                   |
| ----------------------------- | -------- | --------------------------------------------------------- |
| `PUBLIC_FORMSPREE_CONTACT_ID` | No       | Formspree form for the contact page (`/contact`)          |
| `PUBLIC_FORMSPREE_PICKUP_ID`  | No       | Formspree form for the pickup request (`/e-waste#pickup`) |

Each value is a Formspree form ID (the part after `/f/` in `https://formspree.io/f/abcdwxyz`) or that full URL.
A malformed value fails the build on purpose.

These are **not secrets**. A Formspree endpoint is always visible in the page source. They are build-time values, so
**redeploy after changing them**. When a variable is empty, its form keeps the original behaviour: it prepares the
message for the visitor to send on WhatsApp or by email, and nothing is sent to a server.

The variables are declared and validated in `astro.config.mjs` (`env.schema`) and read through `astro:env/client`.

## Formspree setup

1. Create a Formspree account (use an inbox CyberGreen controls, such as `cybergreenengineering@gmail.com`).
2. Create two forms, for example "Website enquiry" and "E-waste pickup request". Copy each form ID.
3. In each form's settings:
   - **Restrict to domain:** `www.cybergreen.co.ug` (and the Vercel preview domain while testing).
   - **reCAPTCHA:** turn it **off**. The site submits with JavaScript (AJAX), and Formspree's built-in reCAPTCHA
     only works for plain HTML form posts. Spam protection comes from the honeypot field (`_gotcha`) and Formspree's
     automatic spam filtering instead.
4. Add the IDs to Vercel (Project → Settings → Environment Variables) for Production and Preview, then redeploy.
5. Submit each form once on the deployed site and confirm the email arrives.

### How the forms behave

- The browser validates first. The name is required, and the email field must be a valid address when filled in.
- On submit, the message is composed exactly as before, and the **Send on WhatsApp**, **Send by email** and
  **Copy message** options are offered.
- With Formspree configured, the submission is also sent as JSON (`Accept: application/json`), with the submit
  button disabled while it sends. The visitor then sees either a confirmation or an error that points them to
  WhatsApp, email or the phone number. Status changes are announced to screen readers through a polite live region.
- With JavaScript disabled, the form posts directly to Formspree, which shows its own thank-you page.
- Submitted field names: pickup form `items, quantity, district, name, organisation, phone, timing, notes`;
  contact form `reason, name, organisation, phone, email, message`. Also sent: `_subject` (email subject) and
  `_gotcha` (honeypot). Formspree uses `email` as the reply-to address on contact enquiries.

Formspree's free plan has a monthly submission limit and adds its own branding. Check the current plan before launch.

## Deploying to Vercel

1. Import the repository in Vercel. The framework (Astro), build command (`npm run build`) and output
   directory (`dist`) are set in `vercel.json`.
2. Add the two Formspree environment variables (above).
3. Add the domains `www.cybergreen.co.ug` and `cybergreen.co.ug`, with the apex redirecting to `www`, and update DNS
   at the `.co.ug` registrar as Vercel instructs.

`vercel.json` also:

- turns on `cleanUrls`. Pages are built as `about.html`, `e-waste.html` and so on (the original file names), served
  at `/about`, `/e-waste` and so on, and the old `.html` URLs permanently redirect (308) to the clean ones, keeping
  `#anchors`. `/index` and `/index.html` redirect to `/`.
- sets security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`).
- sets long-lived caching for hashed build assets (`/_astro/*`) and fonts.

## Project structure

```
public/
  assets/            Original fonts, images, hero illustrations and posters. URLs unchanged (/assets/...)
  robots.txt
src/
  components/        Reusable components, each with a co-located *.module.css
    forms/           ComposeForm (shared shell), PickupForm, ContactForm, Chips
    icons.ts         Line-icon path data (single source)
  data/              Typed content: site.ts (contact details, routes, navigation), services.ts,
                     posters.ts, estimator.ts, faq.ts
  layouts/           BaseLayout.astro (head/SEO, header, CTA band, footer, client script)
  lib/               Pure TypeScript logic shared by the browser scripts and the tests
  pages/             One .astro file per page; file names match the original .html files
  scripts/           Browser behaviour (menu, header shadow, reveal, counters, scroll-spy,
                     estimator, forms, clipboard)
  styles/
    global.css       Fonts, tokens, resets, typography and shared layout/utility classes
    pages/           CSS Modules for page-specific sections
tests/               Vitest unit tests; tests/e2e has Playwright browser tests
scripts/             verify-dist.mjs (link and content checks), e2e.mjs (browser test runner)
```

### Styling conventions

- `src/styles/global.css` holds only shared things: tokens, `@font-face`, resets, headings, `.wrap`, `.stack`,
  `.btn*`, `.label`, `.lead`, `.ticks`, `.plain`, `.split`, section backgrounds (`.dark`, `.white`) and the motion
  hooks (`.rise`, `.reveal`, `.reveal-stagger`, `.js`).
- Everything else is a CSS Module next to its component, or under `src/styles/pages/`.
- JavaScript selects elements with `data-*` attributes, never with CSS Module class names (those are hashed).
- Astro may emit component CSS before `global.css`, so a module rule must beat a global rule by specificity, not by
  source order.

## Editing content

- **Phone, email, address, hours, social links, hashtags:** `src/data/site.ts` (used on every page).
- **Services** (services page, home cards, footer links): `src/data/services.ts`. The `id` values are anchors
  linked from other pages; do not rename them.
- **Posters:** put `NN_name.jpg` (2160 × 2700) and `NN_name_sm.jpg` (540 × 675) in `public/assets/posters/` and add
  an entry to `src/data/posters.ts`.
- **Hero illustrations:** `public/assets/hero/*.png` (960 × 720, transparent background). To use photos, save
  cut-outs or edge-faded images under the same file names so they sit naturally on the green header.
- **Logos:** `public/assets/img/logo-dark.png` is for green or dark backgrounds, and `logo-light.png` for white
  (currently unused).
- **Estimator weights:** `src/data/estimator.ts`.
- **FAQ:** `src/data/faq.ts`.

## Before going live

1. `/about`: replace the "MR" placeholder with a professional photo of Eng. Muhangi Robert.
2. Confirm the phone, email, address and office hours in `src/data/site.ts`.
3. Create the Formspree forms, set the environment variables, redeploy, and send a test submission from each form.
4. The child online protection page refers to CyberGreen's child protection policy and code of conduct. Have both
   in writing before going live.
5. Consider a privacy notice. The site now sends form data to a third party (Formspree), and the site itself cites
   the Data Protection and Privacy Act 2019.

## Fonts

Fraunces and Inter, both under the SIL Open Font License, are self-hosted in `public/assets/fonts`.
