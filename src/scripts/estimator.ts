import { estimate, formatInteger, parseQuantity, stepQuantity } from "../lib/estimate";

/** E-waste weight estimator: recalculates on every edit and on the +/- stepper buttons. */
export function initEstimator(): void {
  const root = document.querySelector<HTMLElement>("[data-estimator]");
  if (!root) return;
  const inputs = Array.from(root.querySelectorAll<HTMLInputElement>("input[data-kg]"));
  const kgOut = root.querySelector<HTMLElement>("[data-est-kg]");
  const countOut = root.querySelector<HTMLElement>("[data-est-n]");

  const calc = (): void => {
    const lines = inputs.map((input) => {
      // Normalise every field (blank/negative/non-numeric -> 0), as the original did.
      const quantity = parseQuantity(input.value);
      input.value = String(quantity);
      return { kg: parseFloat(input.dataset.kg ?? "0"), quantity };
    });
    const result = estimate(lines);
    if (kgOut) kgOut.textContent = formatInteger(result.kg);
    if (countOut) countOut.textContent = formatInteger(result.count);
  };

  root.addEventListener("input", calc);
  for (const button of root.querySelectorAll<HTMLButtonElement>("button[data-step]")) {
    button.addEventListener("click", () => {
      const input = button.parentElement?.querySelector<HTMLInputElement>("input");
      if (!input) return;
      input.value = String(stepQuantity(input.value, parseInt(button.dataset.step ?? "0", 10)));
      calc();
    });
  }
  calc();
}
