import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { extname, join, resolve } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { PAGES, scrollThrough, waitForImages } from "./helpers";

/**
 * Screenshot comparison between the original static site and the Astro build.
 * Both are rendered with reduced motion (so every animation is in its final state) and compared
 * pixel by pixel at several widths. Skipped when the original site is not available.
 */
const ORIGINAL = resolve(process.env.ORIGINAL_DIR ?? join(process.cwd(), "..", "cybergreen-original"));
const WIDTHS = [1366, 1000, 390];
// The migration renders pixel-identical pages, so any difference at all fails the test.
const MAX_DIFF_RATIO = 0;
const OUT = join(process.cwd(), "test-results", "visual-parity");

const types: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

let server: Server;
let originalBase = "";

test.describe("visual parity with the original site @no-formspree", () => {
  test.describe.configure({ mode: "serial" });
  test.skip(!existsSync(join(ORIGINAL, "index.html")), `original site not found at ${ORIGINAL}`);
  test.skip(({ isMobile }) => isMobile, "widths are iterated inside the desktop project");

  test.beforeAll(async () => {
    server = createServer((req, res) => {
      const path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
      const file = join(ORIGINAL, path === "/" ? "index.html" : path);
      if (!file.startsWith(ORIGINAL) || !existsSync(file) || !statSync(file).isFile()) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
      createReadStream(file).pipe(res);
    });
    await new Promise<void>((r) => server.listen(0, r));
    const address = server.address();
    originalBase = `http://localhost:${typeof address === "object" && address ? address.port : 0}`;
    mkdirSync(OUT, { recursive: true });
  });

  test.afterAll(() => {
    server?.close();
  });

  async function capture(page: Page, url: string, title: string): Promise<PNG> {
    const response = await page.goto(url);
    // Guard against comparing two identical error pages.
    expect(response?.status(), url).toBe(200);
    await expect(page).toHaveTitle(title);
    await page.evaluate(() => document.fonts.ready);
    await scrollThrough(page);
    await waitForImages(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    return PNG.sync.read(await page.screenshot({ fullPage: true, animations: "disabled" }));
  }

  for (const info of PAGES) {
    test(`${info.path} matches the original`, async ({ browser }) => {
      test.setTimeout(240_000); // 3 widths x 2 full-page captures
      for (const width of WIDTHS) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
        const page = await context.newPage();
        const before = await capture(page, `${originalBase}/${info.file}`, info.title);
        const after = await capture(page, `http://localhost:4329${info.path}`, info.title);
        await context.close();

        const label = `${info.file.replace(".html", "")}@${width}`;
        expect.soft(`${after.width}x${after.height}`, `${label} page size`).toBe(`${before.width}x${before.height}`);
        if (before.width !== after.width || before.height !== after.height) {
          writeFileSync(join(OUT, `${label}-original.png`), PNG.sync.write(before));
          writeFileSync(join(OUT, `${label}-astro.png`), PNG.sync.write(after));
          continue;
        }
        const diff = new PNG({ width: before.width, height: before.height });
        const changed = pixelmatch(before.data, after.data, diff.data, before.width, before.height, { threshold: 0.1 });
        const ratio = changed / (before.width * before.height);
        if (ratio > 0) {
          writeFileSync(join(OUT, `${label}-diff.png`), PNG.sync.write(diff));
          writeFileSync(join(OUT, `${label}-original.png`), PNG.sync.write(before));
          writeFileSync(join(OUT, `${label}-astro.png`), PNG.sync.write(after));
        }
        expect.soft(ratio, `${label}: ${changed} pixels differ`).toBeLessThanOrEqual(MAX_DIFF_RATIO);
      }
    });
  }
});
