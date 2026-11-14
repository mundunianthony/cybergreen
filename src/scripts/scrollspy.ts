/** Services page: highlight the sub-nav link of the service section in the middle of the viewport. */
export function initServiceScrollSpy(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>("[data-subnav] a");
  if (!links.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const hash = `#${entry.target.id}`;
        links.forEach((link) => {
          if (link.getAttribute("href") === hash) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      }
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  document.querySelectorAll("[data-service][id]").forEach((section) => observer.observe(section));
}
