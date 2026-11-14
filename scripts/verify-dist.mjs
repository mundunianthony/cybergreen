#!/usr/bin/env node
/**
 * Post-build verification for the static output in dist/.
 *
 * 1. Integrity (always): every internal link, in-page anchor, image, download, stylesheet, script
 *    and CSS url() in dist/ resolves to a real file or element.
 * 2. Parity (when the original static site is available): for each page, compares the built HTML
 *    with the original .html file: <html lang>, title, description, Open Graph tags, visible text,
 *    links (with target/rel/download), images (src, alt, size, loading), element ids and aria-labels.
 *
 * Usage: node scripts/verify-dist.mjs [--original <dir>]
 * Default original location: ../cybergreen-original (override with --original or ORIGINAL_DIR).
 * Exits non-zero on any failure.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const argIndex = process.argv.indexOf("--original");
const originalDir = resolve(
  argIndex > -1 ? process.argv[argIndex + 1] : (process.env.ORIGINAL_DIR ?? join(root, "..", "cybergreen-original")),
);
const ORIGIN = "https://www.cybergreen.co.ug";

const pages = [
  "index.html",
  "about.html",
  "services.html",
  "e-waste.html",
  "online-safety.html",
  "child-online-protection.html",
  "resources.html",
  "contact.html",
];

/** Ids that intentionally became data-* hooks (CSS Modules hash class names; ids were script hooks). */
const replacedIds = new Set(["yr", "est-kg", "est-n"]);

let failures = 0;
let checks = 0;
const fail = (msg) => {
  failures++;
  console.error(`  FAIL ${msg}`);
};
const ok = (cond, msg) => {
  checks++;
  if (!cond) fail(msg);
};

if (!existsSync(dist)) {
  console.error("dist/ not found. Run `npm run build` first.");
  process.exit(1);
}

const load = (file) => parse(readFileSync(file, "utf8"), { comment: false });
const builtDocs = new Map(pages.map((p) => [p, load(join(dist, p))]));

// ---------------------------------------------------------------------------------------------
// 1. Integrity
// ---------------------------------------------------------------------------------------------
console.log("Integrity checks (dist/)");

/** Map a root-relative URL path to the file that serves it (Vercel cleanUrls semantics). */
function fileFor(pathname) {
  if (pathname === "/" || pathname === "") return "index.html";
  const clean = decodeURIComponent(pathname.replace(/^\//, ""));
  if (existsSync(join(dist, clean)) && !clean.endsWith("/")) return clean;
  if (existsSync(join(dist, `${clean}.html`))) return `${clean}.html`;
  return null;
}

const internalRefs = [];
for (const [page, doc] of builtDocs) {
  for (const el of doc.querySelectorAll("[href], [src]")) {
    for (const attr of ["href", "src"]) {
      const value = el.getAttribute(attr);
      if (value) internalRefs.push({ page, value, tag: el.tagName.toLowerCase() });
    }
  }
}

for (const { page, value, tag } of internalRefs) {
  if (/^(mailto:|tel:|https?:)/.test(value) && !value.startsWith(ORIGIN)) continue;
  if (value === "#") continue; // placeholder hrefs filled in by the form script
  const url = new URL(value, `${ORIGIN}/${page === "index.html" ? "" : page.replace(/\.html$/, "")}`);
  const target = fileFor(url.pathname);
  ok(target !== null, `${page}: <${tag}> ${value} does not resolve to a file in dist/`);
  if (target && url.hash) {
    const id = decodeURIComponent(url.hash.slice(1));
    const targetDoc = builtDocs.get(target);
    ok(targetDoc?.getElementById(id) != null, `${page}: ${value} points to missing anchor #${id} on ${target}`);
  }
}

const cssDir = join(dist, "_astro");
const cssFiles = readdirSync(cssDir).filter((f) => f.endsWith(".css"));
const inlineCss = [...builtDocs.values()].flatMap((d) => d.querySelectorAll("style").map((s) => s.text));
for (const css of [...cssFiles.map((f) => readFileSync(join(cssDir, f), "utf8")), ...inlineCss]) {
  for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
    const ref = m[1];
    if (ref.startsWith("data:")) continue;
    ok(ref.startsWith("/") && fileFor(ref) !== null, `CSS url(${ref}) does not resolve`);
  }
}
console.log(`  ${internalRefs.length} element references and ${cssFiles.length} stylesheet(s) checked`);

// ---------------------------------------------------------------------------------------------
// 2. Parity with the original static site
// ---------------------------------------------------------------------------------------------
if (!existsSync(join(originalDir, "index.html"))) {
  console.log(`\nParity checks skipped: original site not found at ${originalDir}`);
} else {
  console.log(`\nParity checks against ${originalDir}`);

  /** Original relative URL -> the equivalent URL on the new site. */
  const normaliseOriginalUrl = (value) => {
    if (!value || /^(mailto:|tel:|https?:|#)/.test(value)) return value;
    const [path, hash] = value.split("#");
    let out = path.startsWith("assets/") ? `/${path}` : path;
    if (out === "index.html") out = "/";
    else if (/^[a-z-]+\.html$/.test(out)) out = `/${out.replace(/\.html$/, "")}`;
    return hash !== undefined ? `${out}#${hash}` : out;
  };
  const stripOrigin = (value) => (value?.startsWith(ORIGIN) ? value.slice(ORIGIN.length) || "/" : value);
  const meta = (doc, sel) => doc.querySelector(sel)?.getAttribute("content") ?? null;
  const squash = (text) => text.replace(/\s+/g, "");

  /** Remove additions that have no counterpart in the original. */
  function withoutAdditions(doc) {
    const clone = parse(doc.toString(), { comment: false });
    clone.querySelectorAll("script, style, .skip-link, [data-form-status]").forEach((el) => el.remove());
    clone.querySelectorAll('input[name="_gotcha"]').forEach((el) => el.parentNode.remove());
    clone.querySelectorAll('input[name="_subject"]').forEach((el) => el.remove());
    // The estimator result is now server-rendered (259 / 90) instead of "0" until JS runs.
    clone.querySelectorAll("[data-est-kg], [data-est-n]").forEach((el) => el.set_content("0"));
    return clone;
  }

  const firstDifference = (a, b) => {
    let i = 0;
    while (i < a.length && a[i] === b[i]) i++;
    return `at char ${i}: original "…${a.slice(Math.max(0, i - 40), i + 40)}…" vs new "…${b.slice(Math.max(0, i - 40), i + 40)}…"`;
  };

  for (const page of pages) {
    const orig = load(join(originalDir, page));
    const built = builtDocs.get(page);
    const cleaned = withoutAdditions(built);
    const before = failures;

    ok(
      orig.querySelector("html").getAttribute("lang") === built.querySelector("html").getAttribute("lang"),
      `${page}: html lang differs`,
    );
    ok(orig.querySelector("title").text === built.querySelector("title").text, `${page}: <title> differs`);
    for (const sel of [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:locale"]',
    ]) {
      ok(
        meta(orig, sel) === meta(built, sel),
        `${page}: ${sel} differs ("${meta(orig, sel)}" vs "${meta(built, sel)}")`,
      );
    }
    ok(
      normaliseOriginalUrl(meta(orig, 'meta[property="og:image"]')) ===
        stripOrigin(meta(built, 'meta[property="og:image"]')),
      `${page}: og:image differs`,
    );
    ok(meta(built, 'meta[property="og:image"]')?.startsWith(`${ORIGIN}/`), `${page}: og:image is not absolute`);

    // Visible text, compared with all whitespace removed (markup formatting differs, content must not).
    const origText = squash(orig.querySelector("body").text);
    const newText = squash(cleaned.querySelector("body").text);
    ok(
      origText === newText,
      `${page}: body text differs ${origText === newText ? "" : firstDifference(origText, newText)}`,
    );

    // Links in document order, including target/rel/download.
    const linkSig = (a, normalise) =>
      [
        normalise(a.getAttribute("href")),
        a.getAttribute("target") ?? "",
        a.getAttribute("rel") ?? "",
        a.hasAttribute("download") ? "download" : "",
      ].join(" | ");
    const origLinks = orig.querySelectorAll("body a").map((a) => linkSig(a, normaliseOriginalUrl));
    const newLinks = cleaned.querySelectorAll("body a").map((a) => linkSig(a, (v) => v));
    ok(
      origLinks.length === newLinks.length,
      `${page}: ${origLinks.length} links in original vs ${newLinks.length} now`,
    );
    origLinks.forEach((sig, i) =>
      ok(sig === newLinks[i], `${page}: link ${i + 1} differs: "${sig}" vs "${newLinks[i]}"`),
    );

    // Images in document order.
    const imgSig = (img, normalise) =>
      ["src", "alt", "width", "height", "loading"]
        .map((a) => (a === "src" ? normalise(img.getAttribute(a)) : (img.getAttribute(a) ?? "")))
        .join(" | ");
    const origImgs = orig.querySelectorAll("img").map((i) => imgSig(i, normaliseOriginalUrl));
    const newImgs = built.querySelectorAll("img").map((i) => imgSig(i, (v) => v));
    ok(origImgs.length === newImgs.length, `${page}: ${origImgs.length} images in original vs ${newImgs.length} now`);
    origImgs.forEach((sig, i) =>
      ok(sig === newImgs[i], `${page}: image ${i + 1} differs: "${sig}" vs "${newImgs[i]}"`),
    );

    // Every original id (anchor target / label target) still exists.
    for (const el of orig.querySelectorAll("[id]")) {
      const id = el.getAttribute("id");
      if (replacedIds.has(id)) continue;
      ok(built.getElementById(id) != null, `${page}: id="${id}" is missing`);
    }
    // Every original aria-label is still present.
    const newLabels = new Set(built.querySelectorAll("[aria-label]").map((e) => e.getAttribute("aria-label")));
    for (const el of orig.querySelectorAll("[aria-label]")) {
      const label = el.getAttribute("aria-label");
      ok(newLabels.has(label), `${page}: aria-label "${label}" is missing`);
    }
    // Form controls keep their labels.
    for (const label of orig.querySelectorAll("label[for]")) {
      const id = label.getAttribute("for");
      ok(
        built.querySelector(`label[for="${id}"]`)?.text.trim() === label.text.trim(),
        `${page}: label for #${id} differs`,
      );
    }

    console.log(
      `  ${failures === before ? "ok  " : "FAIL"} ${page}: ${origLinks.length} links, ${origImgs.length} images`,
    );
  }
}

console.log(`\n${checks} checks, ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
