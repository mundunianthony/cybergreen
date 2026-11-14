import { expect, test, type Page, type Route } from "@playwright/test";
import { originalCompose } from "./helpers";

/**
 * Forms with Formspree configured. Runs against a build made with
 * PUBLIC_FORMSPREE_PICKUP_ID=testpickup1 and PUBLIC_FORMSPREE_CONTACT_ID=testcontact1
 * (see scripts/e2e.mjs). Formspree itself is mocked at the network layer, so no real
 * submissions are sent.
 */
const PICKUP = "https://formspree.io/f/testpickup1";
const CONTACT = "https://formspree.io/f/testcontact1";

async function fillPickup(page: Page): Promise<void> {
  await page.goto("/e-waste#pickup");
  await page.locator("#p-name").fill("Jane Nakato");
  await page.locator("#p-phone").fill("+256 700 123456");
}

test.describe("forms with Formspree @formspree", () => {
  test("forms post to the configured endpoints even without JavaScript", async ({ page }) => {
    await page.goto("/e-waste");
    await expect(page.locator("#pickup-form")).toHaveAttribute("action", PICKUP);
    await expect(page.locator("#pickup-form")).toHaveAttribute("method", "post");
    await page.goto("/contact");
    await expect(page.locator("#contact-form")).toHaveAttribute("action", CONTACT);
  });

  test("successful submission shows a confirmation and keeps WhatsApp/email options", async ({ page }) => {
    let body: Record<string, string> | null = null;
    let headers: Record<string, string> = {};
    await page.route(PICKUP, async (route: Route) => {
      body = route.request().postDataJSON() as Record<string, string>;
      headers = route.request().headers();
      await new Promise((r) => setTimeout(r, 300));
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"next":"/thanks"}' });
    });
    await fillPickup(page);
    const submit = page.getByRole("button", { name: "Send request" });
    await submit.click();

    const status = page.locator("#pickup-form ~ [data-form-status]");
    await expect(status).toHaveText("Sending your request…");
    await expect(submit).toBeDisabled();
    await expect(status).toHaveText(
      "Thank you. Your request has been sent to CyberGreen. We reply within one working day.",
    );
    await expect(status).toHaveAttribute("data-state", "success");
    await expect(submit).toBeEnabled();

    expect(headers["accept"]).toBe("application/json");
    expect(body).toEqual({
      items: "Phones and tablets, Laptops and desktops",
      quantity: "About 40",
      district: "Kampala",
      name: "Jane Nakato",
      organisation: "",
      phone: "+256 700 123456",
      timing: "This week",
      notes: "",
      _subject: "E-waste pickup request",
      _gotcha: "",
    });

    const expected = originalCompose("E-waste pickup request", [
      ["Items", "Phones and tablets, Laptops and desktops"],
      ["Quantity", "About 40"],
      ["District", "Kampala"],
      ["Name", "Jane Nakato"],
      ["Phone", "+256 700 123456"],
      ["Timing", "This week"],
    ]);
    const done = page.locator("[data-form-done]");
    await expect(done).toBeVisible();
    await expect(done.locator("[data-form-done-title]")).toHaveText(
      "Prefer WhatsApp or email? Your request is ready to send there too",
    );
    await expect(done.getByRole("link", { name: "Send on WhatsApp" })).toHaveAttribute("href", expected.wa);
    await expect(done.getByRole("link", { name: "Send by email" })).toHaveAttribute("href", expected.em);
  });

  test("a Formspree error offers WhatsApp and email instead", async ({ page }) => {
    await page.route(CONTACT, (route) =>
      route.fulfill({ status: 422, contentType: "application/json", body: '{"errors":[{"message":"bad"}]}' }),
    );
    await page.goto("/contact");
    await page.locator("#c-name").fill("Okello Peter");
    await page.getByRole("button", { name: "Send message" }).click();
    const status = page.locator("[data-form-status]");
    await expect(status).toHaveAttribute("data-state", "error");
    await expect(status).toContainText("could not be sent online");
    await expect(status).toContainText("+256 772 888 866");
    await expect(page.locator("[data-form-done-title]")).toHaveText("Your message is ready to send");
    await expect(page.getByRole("link", { name: "Send on WhatsApp" })).toHaveAttribute(
      "href",
      originalCompose("Website enquiry", [
        ["Reason", "E-waste pickup"],
        ["Name", "Okello Peter"],
      ]).wa,
    );
  });

  test("a network failure is reported, not thrown", async ({ page }) => {
    await page.route(PICKUP, (route) => route.abort("internetdisconnected"));
    await fillPickup(page);
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.locator("[data-form-status]")).toHaveAttribute("data-state", "error");
    await expect(page.locator("[data-form-done]")).toBeVisible();
  });

  test("invalid input never reaches Formspree", async ({ page }) => {
    let calls = 0;
    await page.route(CONTACT, (route) => {
      calls++;
      return route.fulfill({ status: 200, body: "{}" });
    });
    await page.goto("/contact");
    await page.locator("#c-email").fill("not-an-email");
    await page.getByRole("button", { name: "Send message" }).click();
    await page.waitForTimeout(300);
    expect(calls).toBe(0);
    await expect(page.locator("[data-form-status]")).toBeEmpty();
  });

  test("honeypot is out of view, out of the tab order and hidden from assistive tech", async ({ page }) => {
    await page.goto("/contact");
    const trap = page.locator('input[name="_gotcha"]');
    await expect(trap).toHaveAttribute("tabindex", "-1");
    await expect(trap.locator("..")).toHaveAttribute("aria-hidden", "true");
    const box = await trap.boundingBox();
    expect(box === null || box.x + box.width < 0).toBe(true);
    // Tabbing from the message field goes straight to the submit button.
    await page.locator("#c-msg").focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Send message" })).toBeFocused();
  });

  test("without JavaScript the form posts natively to Formspree", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    let posted: { method: string; body: string } | null = null;
    await page.route(PICKUP, async (route) => {
      posted = { method: route.request().method(), body: route.request().postData() ?? "" };
      await route.fulfill({ status: 200, contentType: "text/html", body: "<title>Thanks</title>" });
    });
    await page.goto("/e-waste");
    await page.locator("#p-name").fill("Jane Nakato");
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page).toHaveTitle("Thanks");
    expect(posted).not.toBeNull();
    expect(posted!.method).toBe("POST");
    const params = new URLSearchParams(posted!.body);
    expect(params.getAll("items")).toEqual(["Phones and tablets", "Laptops and desktops"]);
    expect(params.get("name")).toBe("Jane Nakato");
    expect(params.get("_gotcha")).toBe("");
    await context.close();
  });
});
