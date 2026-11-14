import type { Page } from "@playwright/test";

export interface PageInfo {
  path: string;
  file: string;
  title: string;
  nav: string | null;
}

export const PAGES: readonly PageInfo[] = [
  { path: "/", file: "index.html", title: "CyberGreen | E-waste and online safety in Uganda", nav: "Home" },
  { path: "/about", file: "about.html", title: "About CyberGreen Engineering Solutions", nav: "About" },
  { path: "/services", file: "services.html", title: "CyberGreen services", nav: "Services" },
  {
    path: "/e-waste",
    file: "e-waste.html",
    title: "E-waste pickup and data destruction | CyberGreen",
    nav: "E-waste pickup",
  },
  {
    path: "/online-safety",
    file: "online-safety.html",
    title: "Online safety training | CyberGreen",
    nav: "Online safety",
  },
  {
    path: "/child-online-protection",
    file: "child-online-protection.html",
    title: "Child online protection | CyberGreen",
    nav: "Child online protection",
  },
  { path: "/resources", file: "resources.html", title: "Posters and guides | CyberGreen", nav: "Resources" },
  { path: "/contact", file: "contact.html", title: "Contact CyberGreen", nav: null },
];

/** Original estimator maths (assets/js/main.js), used as the oracle in browser tests. */
export function originalEstimate(values: number[]): { kg: string; n: string } {
  const weights = [0.2, 2.5, 9, 6, 8, 7];
  let kg = 0;
  let n = 0;
  values.forEach((v, i) => {
    kg += v * (weights[i] ?? 0);
    n += v;
  });
  return { kg: Math.round(kg).toLocaleString("en-US"), n: n.toLocaleString("en-US") };
}

/** Original message/link building (assets/js/main.js). */
export function originalCompose(subject: string, fields: Array<[string, string]>) {
  const lines = [subject];
  for (const [q, v] of fields) if (v) lines.push(`${q}: ${v}`);
  const txt = lines.join("\n");
  return {
    txt,
    wa: `https://wa.me/256772888866?text=${encodeURIComponent(txt)}`,
    em: `mailto:cybergreenengineering@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(txt)}`,
  };
}

/** Scroll through the whole page so lazy images load and scroll-triggered effects fire. */
export async function scrollThrough(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.6));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 100));
  });
}

export async function waitForImages(page: Page): Promise<void> {
  await page.waitForFunction(() => Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0));
}
