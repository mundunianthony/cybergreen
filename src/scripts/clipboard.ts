function selectText(el: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(el);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

/** Buttons with data-copy="<selector>" copy that element's text; falls back to selecting it. */
export function initCopyButtons(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-copy]")) {
    const label = button.textContent;
    button.addEventListener("click", () => {
      const target = document.querySelector<HTMLElement>(button.dataset.copy ?? "");
      if (!target) return;
      const text = target.textContent ?? "";
      const ok = (): void => {
        button.textContent = "Copied";
        setTimeout(() => {
          button.textContent = label;
        }, 1800);
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(ok, () => selectText(target));
      } else {
        selectText(target);
      }
    });
  }
}
