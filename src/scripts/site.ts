/**
 * Client entry point, loaded once per page by BaseLayout. Replaces the original assets/js/main.js.
 * Each feature is a no-op on pages that do not contain its markup.
 */
import { initCopyButtons } from "./clipboard";
import { initEstimator } from "./estimator";
import { initForms } from "./forms";
import { prefersReducedMotion, supportsIntersectionObserver } from "./motion";
import { initHeaderShadow, initMobileMenu } from "./nav";
import { initReveal } from "./reveal";
import { initServiceScrollSpy } from "./scrollspy";

const reduce = prefersReducedMotion();
// Reveal animations are CSS-gated behind .js, so content stays visible without JS,
// without IntersectionObserver, or when the visitor prefers reduced motion.
if (supportsIntersectionObserver() && !reduce) document.documentElement.classList.add("js");

initMobileMenu();
initHeaderShadow();
initReveal(reduce);
initServiceScrollSpy();
initEstimator();
initForms(reduce);
initCopyButtons();

for (const el of document.querySelectorAll("[data-year]")) el.textContent = String(new Date().getFullYear());
