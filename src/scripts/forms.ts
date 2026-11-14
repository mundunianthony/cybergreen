import { composeMessage, mailtoUrl, whatsappUrl, type ComposeField } from "../lib/compose";
import { submitToFormspree } from "../lib/formspree";

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** Read every [data-q] field in DOM order, exactly as the original compose script did. */
function collectFields(form: HTMLFormElement): ComposeField[] {
  return Array.from(form.querySelectorAll<HTMLElement>("[data-q]")).map((el) => {
    const label = el.getAttribute("data-q") ?? "";
    if (el.hasAttribute("data-chips")) {
      const checked = el.querySelectorAll<HTMLInputElement>("input:checked");
      return { label, value: Array.from(checked, (input) => input.value).join(", ") };
    }
    return { label, value: ((el as FieldElement).value || "").trim() };
  });
}

/** Named fields for Formspree. Repeated names (the "items" checkboxes) are joined with ", ". */
function formPayload(form: HTMLFormElement): Record<string, string> {
  const data: Record<string, string> = {};
  for (const [key, raw] of new FormData(form)) {
    if (typeof raw !== "string") continue;
    const value = raw.trim();
    data[key] = key in data ? `${data[key]}, ${value}` : value;
  }
  return data;
}

interface FormParts {
  status: HTMLElement;
  done: HTMLElement;
  doneTitle: HTMLElement;
  message: HTMLElement;
  whatsapp: HTMLAnchorElement;
  email: HTMLAnchorElement;
  submit: HTMLButtonElement | null;
}

function findParts(form: HTMLFormElement): FormParts | null {
  const panel = form.parentElement;
  const status = panel?.querySelector<HTMLElement>("[data-form-status]");
  const done = panel?.querySelector<HTMLElement>("[data-form-done]");
  const doneTitle = done?.querySelector<HTMLElement>("[data-form-done-title]");
  const message = done?.querySelector<HTMLElement>("[data-form-message]");
  const whatsapp = done?.querySelector<HTMLAnchorElement>("[data-wa]");
  const email = done?.querySelector<HTMLAnchorElement>("[data-email-link]");
  if (!status || !done || !doneTitle || !message || !whatsapp || !email) return null;
  return { status, done, doneTitle, message, whatsapp, email, submit: form.querySelector("[data-submit]") };
}

function setStatus(status: HTMLElement, state: "sending" | "success" | "error" | "idle", text = ""): void {
  status.dataset.state = state;
  status.textContent = text;
}

/**
 * Pickup and contact forms. The browser's built-in validation runs first (submit only fires for
 * valid forms). Then:
 *  - the message is always composed and offered for WhatsApp, email or copying (original behaviour);
 *  - when a Formspree endpoint is configured, the submission is also sent to Formspree and the
 *    visitor sees a sent / failed status. On failure the WhatsApp/email options remain the fallback.
 */
export function initForms(reduce: boolean): void {
  for (const form of document.querySelectorAll<HTMLFormElement>("form[data-compose]")) {
    const parts = findParts(form);
    if (!parts) continue;
    let busy = false;

    const showDone = (title: string): void => {
      parts.doneTitle.textContent = title;
      parts.done.hidden = false;
      parts.done.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (busy) return;

      const subject = form.dataset.compose ?? "";
      const text = composeMessage(subject, collectFields(form));
      parts.message.textContent = text;
      parts.whatsapp.href = whatsappUrl(form.dataset.whatsapp ?? "", text);
      parts.email.href = mailtoUrl(form.dataset.email ?? "", subject, text);

      const readyTitle = form.dataset.titleReady ?? "";
      const endpoint = form.dataset.endpoint;
      if (!endpoint) {
        showDone(readyTitle);
        return;
      }

      busy = true;
      if (parts.submit) parts.submit.disabled = true;
      parts.done.hidden = true;
      setStatus(parts.status, "sending", form.dataset.msgSending);

      const result = await submitToFormspree(endpoint, formPayload(form));

      busy = false;
      if (parts.submit) parts.submit.disabled = false;
      if (result.ok) {
        setStatus(parts.status, "success", form.dataset.msgSuccess);
        showDone(form.dataset.titleSuccess ?? readyTitle);
      } else {
        console.warn("Formspree submission failed:", result.reason, result.detail ?? "");
        setStatus(parts.status, "error", form.dataset.msgError);
        showDone(readyTitle);
      }
    });
  }
}
