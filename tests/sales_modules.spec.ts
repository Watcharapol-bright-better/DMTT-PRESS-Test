import { test, expect, Page } from "@playwright/test";

// Config
const CONFIG = {
  url: "https://sandbox-dev-talon.bright-better.com/Talon/",
  user: "demo4",
  pass: "25004",
};

const MSG = {
  Err: "li.tln-message.message-error.message-error-icon",
  Info: "li.tln-message.message-info",
};

// Auth
async function login(page: Page) {
  await page.goto(CONFIG.url);
  await page.locator("#user_id").fill(CONFIG.user);
  await page.getByRole("textbox", { name: "PASSWORD" }).fill(CONFIG.pass);
  await page.getByRole("button", { name: "LOGIN" }).click();
}

// Navigation
async function navigate(page: Page, funcGroup: string, menuItem: string) {
  await page.locator("a").filter({ hasText: funcGroup }).click();
  const popupPromise = page.waitForEvent("popup");
  await page.locator("a").filter({ hasText: menuItem }).click();
  const popup = await popupPromise;

  await popup.waitForLoadState("domcontentloaded");

  return popup;
}

// Message Helpers
async function expectMsg(page: Page, type: "info" | "error", text: string) {
  const MSGector = type === "info" ? MSG.Info : MSG.Err;
  await expect(page.locator(MSGector, { hasText: text })).toBeVisible();
}

async function closeMsg(page: Page) {
  await page
    .getByRole("dialog", { name: "Message" })
    .getByLabel("Close")
    .click();
}

// Tests
test("Create Quotation (Press)", async ({ page }) => {
  await login(page);
  const popup = await navigate(
    page,
    "Sale Order (Press)",
    "Create Quotation (Press)",
  );

  // Open Subform
  const customerPopup = popup.waitForEvent("popup");
  await popup.locator("#TLN_1_I_CSCODE_SUB").click();
  const custPage = await customerPopup;
  await custPage.locator('input[name="R_ROW:1:j_idt96"]').click(); // Select customer

  // Submit form
  await popup.locator("#TLN_1_I_TYPE").selectOption("0");
  await popup.getByRole("button", { name: "Get FG Details" }).click();
  await popup.getByRole("button", { name: "Submit" }).click();

  await expectMsg(popup, "info", "Successfully Submitted");
});

test("Quotation List (Press)", async ({ page }) => {
  await login(page);
  const popup = await navigate(
    page,
    "Sale Order (Press)",
    "Quotation List (Press)",
  );

  // approve - success
  await popup.locator(".checkbox_label").first().click();
  await popup
    .getByRole("button", { name: "Approved", exact: true })
    .first()
    .click();
  await expectMsg(popup, "info", "Quotation Approved Successfully");
  await closeMsg(popup);

  // approve - already approved
  await popup.locator(".checkbox_label").first().click();
  await popup
    .getByRole("button", { name: "Approved", exact: true })
    .first()
    .click();
  await expectMsg(popup, "error", "Quotation already approved");
  await closeMsg(popup);

  // unapprove - success
  await popup.locator(".checkbox_label").first().click();
  await popup.getByRole("button", { name: "Unapproved" }).click();
  await expectMsg(popup, "info", "Unapproved successfully");
  await closeMsg(popup);

  // unapprove - already unapproved
  await popup.locator(".checkbox_label").first().click();
  await popup.getByRole("button", { name: "Unapproved" }).click();
  await expectMsg(popup, "error", "Quotation already unapproved");
  await closeMsg(popup);
});
