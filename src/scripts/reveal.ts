import { COUNT_DURATION_MS, decimalsOf, easeOutCubic, formatCount } from "../lib/counter";

/** The text node holding the number (the first child of the <b>, before any <small> unit). */
function numberNode(el: HTMLElement): Text {
  const first = el.firstChild;
  if (first instanceof Text) return first;
  const node = document.createTextNode("");
  el.insertBefore(node, first);
  return node;
}

function countUp(el: HTMLElement, reduce: boolean): void {
  const raw = el.getAttribute("data-count") ?? "";
  const end = parseFloat(raw);
  if (Number.isNaN(end)) return;
  const decimals = decimalsOf(raw);
  const prefix = el.getAttribute("data-pre") ?? "";
  const node = numberNode(el);
  const write = (value: number): void => {
    node.nodeValue = formatCount(value, decimals, prefix);
  };

  if (reduce) {
    write(end);
    return;
  }
  let start: number | null = null;
  const step = (ts: number): void => {
    start ??= ts;
    const progress = Math.min((ts - start) / COUNT_DURATION_MS, 1);
    write(end * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function revealStepsLine(el: HTMLElement): void {
  const cover = el.querySelector<SVGLineElement>("[data-line-cover]");
  const len = cover?.getAttribute("data-len");
  if (cover && len !== null && len !== undefined) cover.style.strokeDashoffset = len;
}

/** Size the steps connector to its rendered width and park the cover line over it. */
function setupStepsLines(reduce: boolean): void {
  for (const line of document.querySelectorAll<HTMLElement>("[data-steps-line]")) {
    const cover = line.querySelector<SVGLineElement>("[data-line-cover]");
    const base = line.querySelector<SVGLineElement>("[data-line-base]");
    if (!cover) continue;
    const width = line.getBoundingClientRect().width || 1000;
    cover.setAttribute("x2", String(width));
    base?.setAttribute("x2", String(width));
    cover.style.strokeDasharray = `${width} ${width}`;
    cover.style.strokeDashoffset = "0";
    cover.setAttribute("data-len", String(-width));
    if (reduce) cover.style.strokeDashoffset = String(-width);
  }
}

/**
 * Scroll-triggered effects: adds .in to .reveal / .reveal-stagger blocks, starts counters and
 * draws the steps connector the first time each element enters the viewport.
 */
export function initReveal(reduce: boolean): void {
  const targets = document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger, [data-count], [data-steps-line]");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("in");
          if (el.hasAttribute("data-count")) countUp(el, reduce);
          if (el.hasAttribute("data-steps-line")) revealStepsLine(el);
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    targets.forEach((el) => observer.observe(el));
  } else {
    targets.forEach((el) => el.classList.add("in"));
  }

  setupStepsLines(reduce);
}
