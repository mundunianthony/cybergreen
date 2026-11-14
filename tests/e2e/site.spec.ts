import { expect, test, type Page } from "@playwright/test";
import { PAGES, originalEstimate, scrollThrough, waitForImages } from "./helpers";

const isMobile = (page: Page): boolean => (page.viewportSize()?.width ?? 0) <= 1120;

test.describe("pages, navigation and assets", () => {
  for (const info of PAGES) {
    test(`${info.path} renders with its title, active nav item and no broken requests`, async ({ page }) => {
      const failed: string[] = [];
      page.on("response", (r) => {
        if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
      });
      page.on("requestfailed", (r) => failed.push(`failed ${r.url()}`));
      const consoleErrors: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(m.text());
      });

      const response = await page.goto(info.path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(info.title);
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(page.locator("h1")).toHaveCount(1);

      const current = page.locator('#menu a[aria-current="page"]');
      await expect(current).toHaveCount(1);
      await expect(current).toHaveText(info.nav ?? "Contact us");

      await scrollThrough(page);
      await waitForImages(page);
      // Browsers only download a font face once the page uses it (e.g. italic Fraunces appears on
      // some pages only), so check that nothing failed and that the faces in use are loaded.
      await page.evaluate(() => document.fonts.ready);
      const fonts = await page.evaluate(() =>
        Array.from(document.fonts, (f) => `${f.family} ${f.style} ${f.status}`).filter((f) => !f.endsWith("unloaded")),
      );
      expect(fonts.filter((f) => f.endsWith("error"))).toEqual([]);
      expect(fonts).toEqual(expect.arrayContaining(["Inter normal loaded", "Fraunces normal loaded"]));
      expect(failed).toEqual([]);
      expect(consoleErrors).toEqual([]);
    });
  }

  test("the original .html file names are still served", async ({ page }) => {
    for (const info of PAGES) {
      const res = await page.goto(`/${info.file}`);
      expect(res?.status(), info.file).toBe(200);
      await expect(page).toHaveTitle(info.title);
    }
  });

  test("main menu links reach every page", async ({ page }) => {
    test.setTimeout(120_000); // eight navigations
    for (const target of PAGES) {
      await page.goto("/");
      if (isMobile(page)) await page.locator("[data-nav-toggle]").click();
      const label = target.nav ?? "Contact us";
      await page.locator("#menu").getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveTitle(target.title);
    }
  });

  test("footer service links land on the right sections", async ({ page }) => {
    await page.goto("/");
    const links = page.locator("footer").getByRole("link");
    const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    expect(hrefs).toEqual([
      "/",
      "/about",
      "/services",
      "/e-waste",
      "/online-safety",
      "/child-online-protection",
      "/resources",
      "/contact",
      "/services#e-waste",
      "/services#online-safety",
      "/services#consultancy",
      "/services#research",
      "/services#child-protection",
      "tel:+256772888866",
      "mailto:cybergreenengineering@gmail.com",
      "https://x.com/cybergreenuganda",
    ]);
  });

  for (const [url, id] of [
    ["/e-waste#pickup", "pickup"],
    ["/e-waste#accept", "accept"],
    ["/child-online-protection#help", "help"],
    ["/services#research", "research"],
    ["/services#child-protection", "child-protection"],
  ] as const) {
    test(`deep link ${url} scrolls to its section`, async ({ page }) => {
      await page.goto(url);
      await expect(page.locator(`#${id}`)).toBeInViewport();
    });
  }

  test("posters open full size and download", async ({ page }) => {
    await page.goto("/resources");
    const downloads = page.getByRole("link", { name: "Download" });
    await expect(downloads).toHaveCount(9);
    for (const link of await downloads.all()) {
      await expect(link).toHaveAttribute("download", "");
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^\/assets\/posters\/\d\d_[a-z_]+\.jpg$/);
      const res = await page.request.get(href ?? "");
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/jpeg");
    }
  });
});

test.describe("header and menu", () => {
  test("mobile menu opens, closes, and syncs aria-expanded", async ({ page }) => {
    await page.goto("/about");
    const toggle = page.locator("[data-nav-toggle]");
    const menu = page.locator("#menu");
    if (!isMobile(page)) {
      await expect(toggle).toBeHidden();
      await expect(menu).toBeVisible();
      return;
    }
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeHidden();
    // Escape closes the menu and returns focus to the toggle (accessibility addition).
    await toggle.click();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("header gains a shadow after scrolling", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("[data-site-header]");
    await expect(header).not.toHaveAttribute("data-scrolled");
    expect(await header.evaluate((el) => getComputedStyle(el).boxShadow)).toBe("none");
    await page.mouse.wheel(0, 600);
    await expect(header).toHaveAttribute("data-scrolled", "");
    await expect.poll(() => header.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe("none");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).not.toHaveAttribute("data-scrolled");
  });

  test("skip link jumps to the main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });
});

test.describe("motion", () => {
  test("reveal blocks start hidden and fade in when scrolled into view", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bjs\b/);
    const block = page.locator("section.dark .sec-head.reveal").last();
    expect(await block.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
    await block.scrollIntoViewIfNeeded();
    await expect(block).toHaveClass(/\bin\b/);
    await expect.poll(() => block.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });

  test("counters animate up to their final values", async ({ page }) => {
    await page.goto("/");
    const stats = page.locator("[data-count]");
    await stats.first().scrollIntoViewIfNeeded();
    // Mid-animation value is lower than the target...
    await expect.poll(() => stats.first().evaluate((el) => el.firstChild?.nodeValue)).not.toBe("41,000");
    // ...and settles on the original formatting, units intact.
    await expect(stats.nth(0)).toHaveText("41,000t");
    await expect(stats.nth(1)).toHaveText("200t");
    await expect(stats.nth(2)).toHaveText("UGX 72bn");
    await expect(page.getByText("<1%", { exact: true })).toBeVisible();
  });

  test("steps connector line is drawn when the steps scroll into view", async ({ page }) => {
    test.skip(isMobile(page) && (page.viewportSize()?.width ?? 0) <= 880, "connector is hidden at <=880px");
    await page.goto("/");
    const line = page.locator("[data-steps-line]").first();
    await line.scrollIntoViewIfNeeded();
    await expect(line).toHaveClass(/\bin\b/);
    const cover = line.locator("[data-line-cover]");
    const width = await line.evaluate((el) => el.getBoundingClientRect().width);
    await expect(cover).toHaveAttribute("x2", String(width));
    // Same unitless offset the original script set; computed as px by the browser.
    expect(parseFloat(await cover.evaluate((el) => (el as SVGElement).style.strokeDashoffset))).toBe(-width);
  });

  test("reduced motion: content is visible immediately and animations are off", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/\bjs\b/);
    const hidden = await page.$$eval(
      ".reveal, .reveal-stagger > *",
      (els) => els.filter((el) => getComputedStyle(el).opacity !== "1").length,
    );
    expect(hidden).toBe(0);
    const marqueeTrack = page.locator('[aria-label^="Items we collect"] > div');
    expect(await marqueeTrack.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    // Counters jump straight to their final value when they come into view.
    const first = page.locator("[data-count]").first();
    await first.scrollIntoViewIfNeeded();
    await expect(first).toHaveText("41,000t");

    await page.goto("/about");
    const faderImages = page.locator('[aria-label="Illustrations"] img');
    expect(await faderImages.evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity))).toEqual([
      "1",
      "0",
      "0",
    ]);
    expect(await faderImages.first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    await context.close();
  });
});

test.describe("services page", () => {
  test("sub-nav highlights the service in view", async ({ page }) => {
    await page.goto("/services");
    const links = page.locator("[data-subnav] a");
    await expect(links).toHaveText([
      "E-waste management",
      "Online safety and cybersecurity",
      "Engineering and ICT consultancy",
      "Research and capacity building",
      "Child online protection",
    ]);
    for (const id of ["consultancy", "research", "e-waste"]) {
      await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await expect(page.locator(`[data-subnav] a[href="#${id}"]`)).toHaveAttribute("aria-current", "true");
      await expect(page.locator('[data-subnav] a[aria-current="true"]')).toHaveCount(1);
    }
  });
});

test.describe("e-waste estimator", () => {
  test("matches the original calculation for typed and stepped quantities", async ({ page }) => {
    await page.goto("/e-waste");
    const kg = page.locator("[data-est-kg]");
    const n = page.locator("[data-est-n]");
    const read = async () => ({ kg: (await kg.textContent()) ?? "", n: (await n.textContent()) ?? "" });

    expect(await read()).toEqual(originalEstimate([40, 25, 10, 10, 3, 2]));

    await page.locator("#q1").fill("30");
    expect(await read()).toEqual(originalEstimate([40, 30, 10, 10, 3, 2]));

    await page.getByRole("button", { name: "Fewer printers" }).click();
    expect(await read()).toEqual(originalEstimate([40, 30, 10, 10, 2, 2]));

    await page.getByRole("button", { name: "More solar batteries and ups units" }).click();
    await page.getByRole("button", { name: "More solar batteries and ups units" }).click();
    expect(await read()).toEqual(originalEstimate([40, 30, 10, 10, 2, 4]));

    await page.locator("#q2").fill("1250");
    expect(await read()).toEqual(originalEstimate([40, 30, 1250, 10, 2, 4]));
    expect((await read()).kg).toContain(",");

    // Fewer never goes below zero.
    for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Fewer printers" }).click();
    await expect(page.locator("#q4")).toHaveValue("0");
    expect(await read()).toEqual(originalEstimate([40, 30, 1250, 10, 0, 4]));
  });
});

test.describe("FAQ", () => {
  test("details elements keep native open/close behaviour", async ({ page }) => {
    await page.goto("/e-waste");
    const details = page.locator("details");
    await expect(details).toHaveCount(5);
    await expect(details.first()).toHaveAttribute("open", "");
    await expect(details.nth(1)).not.toHaveAttribute("open");
    await details.nth(1).locator("summary").click();
    await expect(details.nth(1)).toHaveAttribute("open", "");
    await expect(details.nth(1).getByText("Devices recent enough to refurbish")).toBeVisible();
    await details.first().locator("summary").click();
    await expect(details.first()).not.toHaveAttribute("open");
  });
});

test.describe("responsive layout", () => {
  test("forms stack on small screens and inputs are at least 16px (no iOS zoom)", async ({ page }) => {
    await page.goto("/contact");
    const name = page.locator("#c-name");
    const org = page.locator("#c-org");
    expect(await name.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
    const a = await name.boundingBox();
    const b = await org.boundingBox();
    if ((page.viewportSize()?.width ?? 0) <= 560) expect(b!.y).toBeGreaterThan(a!.y);
    else expect(b!.y).toBeCloseTo(a!.y, 0);
    // No horizontal overflow on any page.
    for (const info of ["/", "/e-waste", "/services", "/resources"]) {
      await page.goto(info);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, info).toBeLessThanOrEqual(0);
    }
  });
});
