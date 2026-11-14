export interface ComposeField {
  /** Label shown in the message, e.g. "Name". Comes from the field's data-q attribute. */
  label: string;
  value: string;
}

/**
 * Build the plain-text message exactly as the original site did:
 * the subject on the first line, then "Label: value" for every non-empty field, joined by "\n".
 */
export function composeMessage(subject: string, fields: readonly ComposeField[]): string {
  const lines = [subject];
  for (const { label, value } of fields) {
    if (value) lines.push(`${label}: ${value}`);
  }
  return lines.join("\n");
}

/** WhatsApp click-to-chat link. `number` is the international number without "+". */
export const whatsappUrl = (number: string, text: string): string =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export const mailtoUrl = (email: string, subject: string, body: string): string =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
