import { defineConfig, devices } from "@playwright/test";

/**
 * Browser tests against the built site served by `astro preview`.
 * Run through `npm run test:e2e` (scripts/e2e.mjs), which builds the site in the right mode first.
 *
 * Uses the locally installed Microsoft Edge by default so no browser download is needed.
 * Set PW_CHANNEL=chrome to use Chrome, or PW_CHANNEL=bundled to use Playwright's own Chromium
 * (after `npx playwright install chromium`).
 */
const channel = process.env.PW_CHANNEL === "bundled" ? undefined : (process.env.PW_CHANNEL ?? "msedge");
const port = 4329;

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "*.spec.ts",
  fullyParallel: true,
  reporter: [["list"]],
  timeout: 60_000,
  // One retry absorbs rare navigation aborts under heavy parallel load; retried passes are reported as "flaky".
  retries: 1,
  use: {
    baseURL: `http://localhost:${port}`,
    channel,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel, viewport: { width: 1366, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel } },
  ],
  webServer: {
    command: `npx astro preview --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
