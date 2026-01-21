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

// run tests
test("Create Quotation (Press)", async ({ page }) => {
  await login(page);
  const popup = await navigate(
    page,
    "Sale Order (Press)",
    "Create Quotation (Press)",
  );

  // Open Customer Subform
  const customerPopup = popup.waitForEvent("popup");
  await popup.locator("#TLN_1_I_CSCODE_SUB").click();
  const custPage = await customerPopup;
  await custPage.waitForLoadState("domcontentloaded");
  await custPage.locator('input[name="R_ROW:1:j_idt96"]').click(); // Select customer
  
  // Open Currency Subform 
  const currencyPopup = popup.waitForEvent("popup");
  await popup.locator('#TLN_1_I_CURRENCY_SUB').click();
  const currencyPage = await currencyPopup;
  await currencyPage.waitForLoadState("domcontentloaded");
  await currencyPage.locator('input[name="R_ROW:15:j_idt96"]').click(); // Select currency code

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

test("Create Sales Order (Press)", async ({ page }) => {
  await login(page);
  const popup = await navigate(
    page,
    "Sale Order (Press)",
    "Quotation List (Press)",
  );

  // approve quotation first
  await popup.locator(".checkbox_label").first().click();
  await popup
    .getByRole("button", { name: "Approved", exact: true })
    .first()
    .click();
  await closeMsg(popup);

  // Click Issue Sales Order
  const soPopupPromise = popup.waitForEvent("popup");
  await popup.locator('input[name="2_Issue Sales Order_0"]').click();
  const soPopup = await soPopupPromise;

  await soPopup.waitForLoadState("domcontentloaded");

  // input data in the Box Details
  await soPopup.locator("#TLN_1_I_DLYDATE_flatpickr_btn").click();
  await soPopup.getByLabel("January 29,").nth(1).click();
  await soPopup.locator("#TLN_1_I_DLYDATE").fill("01/29/2026");
  await soPopup.locator("input[id='TLN_2_I_QTY_0']").fill("10");
  await soPopup.locator("input[id='TLN_2_I_QTY_1']").fill("2");
  await soPopup.locator("input[id='TLN_2_I_QTY_2']").fill("12");

  await soPopup.getByRole("button", { name: "Save" }).click();
  await expectMsg(soPopup, "info", "Successfully Submitted");
});

test("Sales Order List (Press)", async ({ page }) => {
  await login(page);
  const popup = await navigate(
    page,
    "Sale Order (Press)",
    "Sales Order List (Press)",
  );

  // await popup.locator(".checkbox_label").first().click();
  // await popup.getByRole("button", { name: "Cancel" }).click();
  // await expectMsg(popup, "info", "Cancelled SO Detail Successfully");
  // await closeMsg(popup);

  await popup.locator(".checkbox_label").first().click();
  await popup.getByRole("button", { name: "Cancel" }).click();
  await expectMsg(popup, "error", "SO Detail is already cancelled");
  await closeMsg(popup);

  await popup.locator(".checkbox_label").first().click();
  await popup
    .getByRole("button", { name: "Close SO", exact: true })
    .first()
    .click();
  await expectMsg(popup, "error", "SO Detail is already cancelled");
  await closeMsg(popup);
});


test('Confirm Delivery Order (Press)', async ({ page }) => {
  await login(page);
  const popup = await navigate(
    page,
    "Sale Order (Press)",
    "Confirm Delivery Order (Press)",
  );
  
  // Click Checkbox
  await popup.locator(".checkbox_label").first().click();
  await popup
    .getByRole("button", { name: "Confirm" })
    .first()
    .click();
  await expectMsg(popup, "error", "Delivery Qty does not equal to SO Qty");
  await closeMsg(popup);

  // Cancel click Checkbox 
  await popup.locator(".checkbox_label").first().click();
  
  await popup.locator('#TLN_2_CHK_6 > tbody > .selectionTableRow > td > .checkbox_label').click();
  await popup
    .getByRole("button", { name: "Confirm" })
    .first()
    .click();
  await expectMsg(popup, "error", "Delivery Qty does not equal to SO Qty");
  await closeMsg(popup);

});