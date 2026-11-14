const FORMSPREE_ORIGIN = "https://formspree.io";
const ID_PATTERN = /^[A-Za-z0-9]+$/;

/**
 * Turn a configured Formspree value (a form ID such as "xyzabcde", or a full
 * "https://formspree.io/f/xyzabcde" URL) into an endpoint URL.
 * Returns undefined when nothing is configured. Throws on malformed values so a typo fails the build
 * instead of shipping a form that silently posts to the wrong place.
 */
export function formspreeEndpoint(raw: string | undefined, name = "Formspree form ID"): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  const match = /^https:\/\/formspree\.io\/f\/([^/?#]+)\/?$/.exec(value);
  const id = match ? match[1] : value;
  if (!id || !ID_PATTERN.test(id)) {
    throw new Error(`${name} is not a valid Formspree form ID or endpoint URL: "${value}"`);
  }
  return `${FORMSPREE_ORIGIN}/f/${id}`;
}

export type FormspreeResult = { ok: true } | { ok: false; reason: "network" | "timeout" | "rejected"; detail?: string };

interface FormspreeErrorBody {
  error?: string;
  errors?: Array<{ message?: string }>;
}

/**
 * POST a submission to Formspree's AJAX API.
 * Never throws: every failure is reported as `{ ok: false }` so the caller can offer the
 * WhatsApp/email fallback.
 */
export async function submitToFormspree(
  endpoint: string,
  data: Record<string, string>,
  { fetchImpl = fetch, timeoutMs = 15000 }: { fetchImpl?: typeof fetch; timeoutMs?: number } = {},
): Promise<FormspreeResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    if (response.ok) return { ok: true };
    let detail: string | undefined;
    try {
      const body = (await response.json()) as FormspreeErrorBody;
      detail =
        body.errors
          ?.map((e) => e.message)
          .filter(Boolean)
          .join("; ") || body.error;
    } catch {
      // Non-JSON error body; the status code is enough.
    }
    return { ok: false, reason: "rejected", detail: detail ?? `HTTP ${response.status}` };
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === "AbortError";
    return { ok: false, reason: aborted ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
}
