import { describe, expect, it } from "vitest";
import { site } from "../src/data/site";
import { composeMessage, mailtoUrl, whatsappUrl } from "../src/lib/compose";

/** Reference: message and link building from the original assets/js/main.js. */
function original(subject: string, fields: Array<[string, string]>) {
  const lines = [subject];
  fields.forEach(([q, v]) => {
    if (v) lines.push(q + ": " + v);
  });
  const txt = lines.join("\n");
  return {
    txt,
    wa: "https://wa.me/256772888866?text=" + encodeURIComponent(txt),
    em:
      "mailto:cybergreenengineering@gmail.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(txt),
  };
}

function current(subject: string, fields: Array<[string, string]>) {
  const txt = composeMessage(
    subject,
    fields.map(([label, value]) => ({ label, value })),
  );
  return {
    txt,
    wa: whatsappUrl(site.phone.whatsapp, txt),
    em: mailtoUrl(site.email, subject, txt),
  };
}

describe("WhatsApp and email message generation", () => {
  it("uses the original WhatsApp number and email address", () => {
    expect(site.phone.whatsapp).toBe("256772888866");
    expect(site.email).toBe("cybergreenengineering@gmail.com");
  });

  it("builds the pickup request exactly as before (default form values)", () => {
    const fields: Array<[string, string]> = [
      ["Items", "Phones and tablets, Laptops and desktops"],
      ["Quantity", "About 40"],
      ["District", "Kampala"],
      ["Name", "Jane Nakato"],
      ["Organisation", ""],
      ["Phone", "+256 700 000000"],
      ["Timing", "This week"],
      ["Notes", "30 desktops & 2 servers in our Ntinda office, ground floor."],
    ];
    const result = current("E-waste pickup request", fields);
    expect(result).toEqual(original("E-waste pickup request", fields));
    expect(result.txt).toBe(
      [
        "E-waste pickup request",
        "Items: Phones and tablets, Laptops and desktops",
        "Quantity: About 40",
        "District: Kampala",
        "Name: Jane Nakato",
        "Phone: +256 700 000000",
        "Timing: This week",
        "Notes: 30 desktops & 2 servers in our Ntinda office, ground floor.",
      ].join("\n"),
    );
    expect(result.wa).toMatch(/^https:\/\/wa\.me\/256772888866\?text=E-waste%20pickup%20request%0AItems%3A%20/);
    expect(result.em).toContain("subject=E-waste%20pickup%20request&body=");
    expect(result.em).toContain("30%20desktops%20%26%202%20servers");
  });

  it("builds the contact enquiry exactly as before, skipping empty fields", () => {
    const fields: Array<[string, string]> = [
      ["Reason", "Training request"],
      ["Name", "Okello Peter"],
      ["Organisation", "St. Mary's College"],
      ["Phone", ""],
      ["Email", "peter@example.org"],
      ["Message", "Line one\nLine two? Yes: 100% = ok #1"],
    ];
    expect(current("Website enquiry", fields)).toEqual(original("Website enquiry", fields));
  });

  it("returns only the subject when every field is empty", () => {
    expect(current("Website enquiry", [["Name", ""]])).toEqual(original("Website enquiry", [["Name", ""]]));
  });
});
