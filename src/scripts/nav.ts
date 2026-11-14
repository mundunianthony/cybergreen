/** Mobile menu: the toggle opens/closes the menu and keeps aria-expanded in sync. Escape closes it. */
export function initMobileMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const menu = document.querySelector<HTMLElement>("[data-nav-menu]");
  if (!toggle || !menu) return;

  const setOpen = (open: boolean): void => {
    menu.toggleAttribute("data-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  toggle.addEventListener("click", () => setOpen(!menu.hasAttribute("data-open")));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.hasAttribute("data-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/** Adds a shadow under the sticky header once the page has scrolled more than 8px. */
export function initHeaderShadow(): void {
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  if (!header) return;
  const onScroll = (): void => {
    header.toggleAttribute("data-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
