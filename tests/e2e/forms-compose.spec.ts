import { expect, test } from "@playwright/test";
import { originalCompose } from "./helpers";

/**
 * Forms with no Formspree IDs configured: the original behaviour (prepare a message, send it by
 * WhatsApp or email, or copy it). Runs against a build without PUBLIC_FORMSPREE_* variables.
 */
test.describe("forms without Formspree @no-formspree", () => {
  test("pickup form validates, then prepares the original WhatsApp and email messages", async ({ page }) => {
    await page.goto("/e-waste#pickup");
    const form = page.locator("#pickup-form");
    await expect(form).not.toHaveAttribute("action");
    const submit = form.getByRole("button", { name: "Prepare request" });
    const done = page.locator("#pickup-msg").locator("..");

    // Native validation: name is required.
    await submit.click();
    await expect(done).toBeHidden();
    expect(await page.locator("#p-name").evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);

    await page.getByText("Servers", { exact: true }).click();
    await page.getByText("Laptops and desktops", { exact: true }).click(); // untick a default
    await page.locator("#p-qty").fill("  12 desktops ");
    await page.locator("#p-where").selectOption("Wakiso");
    await page.locator("#p-name").fill("Jane Nakato");
    await page.locator("#p-phone").fill("+256 700 123456");
    await page.locator("#p-when").selectOption("Flexible");
    await page.locator("#p-msg").fill("Ground floor & store room #2\nCall first?");
    await submit.click();

    const expected = originalCompose("E-waste pickup request", [
      ["Items", "Phones and tablets, Servers"],
      ["Quantity", "12 desktops"],
      ["District", "Wakiso"],
      ["Name", "Jane Nakato"],
      ["Organisation", ""],
      ["Phone", "+256 700 123456"],
      ["Timing", "Flexible"],
      ["Notes", "Ground floor & store room #2\nCall first?"],
    ]);
    await expect(done).toBeVisible();
    await expect(done.locator("b").first()).toHaveText("Your request is ready to send");
    expect(await page.locator("#pickup-msg").textContent()).toBe(expected.txt);
    await expect(done.getByRole("link", { name: "Send on WhatsApp" })).toHaveAttribute("href", expected.wa);
    await expect(done.getByRole("link", { name: "Send on WhatsApp" })).toHaveAttribute("target", "_blank");
    await expect(done.getByRole("link", { name: "Send by email" })).toHaveAttribute("href", expected.em);
    await expect(done).toBeInViewport();
    await expect(page.locator("[data-form-status]").first()).toBeHidden();
  });

  test("contact form prepares the original message", async ({ page }) => {
    await page.goto("/contact");
    await page.getByText("Consultancy", { exact: true }).click();
    await page.locator("#c-name").fill("Okello Peter");
    await page.locator("#c-email").fill("peter@example.org");
    await page.locator("#c-msg").fill("We need an ICT lab plan.");
    await page.getByRole("button", { name: "Prepare message" }).click();

    const expected = originalCompose("Website enquiry", [
      ["Reason", "Consultancy"],
      ["Name", "Okello Peter"],
      ["Organisation", ""],
      ["Phone", ""],
      ["Email", "peter@example.org"],
      ["Message", "We need an ICT lab plan."],
    ]);
    expect(await page.locator("#contact-msg").textContent()).toBe(expected.txt);
    await expect(page.getByRole("link", { name: "Send on WhatsApp" })).toHaveAttribute("href", expected.wa);
    await expect(page.getByRole("link", { name: "Send by email" })).toHaveAttribute("href", expected.em);
  });

  test("email field uses native email validation", async ({ page }) => {
    await page.goto("/contact");
    await page.locator("#c-name").fill("Okello Peter");
    await page.locator("#c-email").fill("not-an-email");
    await page.getByRole("button", { name: "Prepare message" }).click();
    await expect(page.locator("#contact-msg")).toBeHidden();
    expect(await page.locator("#c-email").evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
  });

  test("copy button copies the message and resets its label", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "clipboard permissions are Chromium-only");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/contact");
    await page.locator("#c-name").fill("Okello Peter");
    await page.getByRole("button", { name: "Prepare message" }).click();
    // Locate by attribute: the accessible name changes to "Copied" while the confirmation shows.
    const copy = page.locator('[data-copy="#contact-msg"]');
    await copy.click();
    await expect(copy).toHaveText("Copied");
    // Windows normalises clipboard line endings to CRLF on read.
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied.replace(/\r\n/g, "\n")).toBe("Website enquiry\nReason: E-waste pickup\nName: Okello Peter");
    await expect(copy).toHaveText("Copy message", { timeout: 4000 });
  });

  test("radio chips are keyboard operable", async ({ page }) => {
    await page.goto("/contact");
    const first = page.locator('input[name="reason"]').first();
    await first.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator('input[name="reason"][value="Data destruction"]')).toBeChecked();
  });
});
