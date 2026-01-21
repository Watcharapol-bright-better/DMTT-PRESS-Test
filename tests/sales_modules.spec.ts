import { test } from "@playwright/test";
import { TalonBase } from "./utils/talon_base";

test("Create Quotation (Press)", async ({ page }) => {
  let tln = new TalonBase(page);
  await tln.login();
  
  const Ctx = await tln.navigate(
    "Sale Order (Press)",
    "Create Quotation (Press)",
  );

  // Open Customer Subform
  const custPage = await tln.openPopup(Ctx, "#TLN_1_I_CSCODE_SUB");
  await custPage.locator('input[name="R_ROW:1:j_idt96"]').click();

  // Open Currency Subform
  const currencyPage = await tln.openPopup(Ctx, "#TLN_1_I_CURRENCY_SUB");
  await currencyPage.locator('input[name="R_ROW:15:j_idt96"]').click();

  // Submit form
  await Ctx.locator("#TLN_1_I_TYPE").selectOption("0");
  await tln.clickButton(Ctx, "Get FG Details");
  await tln.clickButton(Ctx, "Submit");

  await tln.expectMsg(Ctx, "info", "Successfully Submitted");
});

test("Quotation List (Press)", async ({ page }) => {
  let tln = new TalonBase(page);
  await tln.login();
  
  const Ctx = await tln.navigate(
    "Sale Order (Press)",
    "Quotation List (Press)",
  );

  // approve - success
  await tln.selectCheckbox(Ctx);
  await tln.clickButton(Ctx, "Approved", true);
  await tln.expectMsg(Ctx, "info", "Quotation Approved Successfully");
  await tln.closeMsg(Ctx);

  // approve - already approved
  await tln.selectCheckbox(Ctx);
  await tln.clickButton(Ctx, "Approved", true);
  await tln.expectMsg(Ctx, "error", "Quotation already approved");
  await tln.closeMsg(Ctx);

  // unapprove - success
  await tln.selectCheckbox(Ctx);
  await tln.clickButton(Ctx, "Unapproved");
  await tln.expectMsg(Ctx, "info", "Unapproved successfully");
  await tln.closeMsg(Ctx);

  // unapprove - already unapproved
  await tln.selectCheckbox(Ctx);
  await tln.clickButton(Ctx, "Unapproved");
  await tln.expectMsg(Ctx, "error", "Quotation already unapproved");
  await tln.closeMsg(Ctx);
});

test("Create Sales Order (Press)", async ({ page }) => {
  let tln = new TalonBase(page);
  await tln.login();
  
  const Ctx = await tln.navigate(
    "Sale Order (Press)",
    "Quotation List (Press)",
  );

  // approve quotation first
  await tln.selectCheckbox(Ctx);
  await tln.clickButton(Ctx, "Approved", true);
  await tln.closeMsg(Ctx);

  // Click Issue Sales Order
  const soPopup = await tln.openPopup(
    Ctx,
    'input[name="2_Issue Sales Order_0"]',
  );

  // input data in the Box Details
  await soPopup.locator("#TLN_1_I_DLYDATE_flatpickr_btn").click();
  await soPopup.getByLabel("January 29,").nth(1).click();
  await soPopup.locator("#TLN_1_I_DLYDATE").fill("01/29/2026");
  await soPopup.locator("input[id='TLN_2_I_QTY_0']").fill("10");
  await soPopup.locator("input[id='TLN_2_I_QTY_1']").fill("2");
  await soPopup.locator("input[id='TLN_2_I_QTY_2']").fill("12");

  await tln.clickButton(soPopup, "Save");
  await tln.expectMsg(soPopup, "info", "Successfully Submitted");
});

test("Sales Order List (Press)", async ({ page }) => {
  let tln = new TalonBase(page);
  await tln.login();
  
  const Ctx = await tln.navigate(
    "Sale Order (Press)",
    "Sales Order List (Press)",
  );

  await tln.selectCheckbox(Ctx);
  await tln.clickButton(Ctx, "Cancel");
  await tln.expectMsg(Ctx, "error", "SO Detail is already cancelled");
  await tln.closeMsg(Ctx);

  await tln.selectCheckbox(Ctx);
  await tln.clickButton(Ctx, "Close SO", true);
  await tln.expectMsg(Ctx, "error", "SO Detail is already cancelled");
  await tln.closeMsg(Ctx);
});

test("Confirm Delivery Order (Press)", async ({ page }) => {
  let tln = new TalonBase(page);
  await tln.login();
  
  const Ctx = await tln.navigate(
    "Sale Order (Press)",
    "Confirm Delivery Order (Press)",
  );

  // Click Checkbox
  await tln.selectCheckbox(Ctx);
  await tln.clickButton(Ctx, "Confirm");
  await tln.expectMsg(
    Ctx,
    "error",
    "Delivery Qty does not equal to SO Qty",
  );
  await tln.closeMsg(Ctx);

  // Cancel click Checkbox
  await tln.selectCheckbox(Ctx);

  await Ctx
    .locator(
      "#TLN_2_CHK_6 > tbody > .selectionTableRow > td > .checkbox_label",
    )
    .click();
  await tln.clickButton(Ctx, "Confirm");
  await tln.expectMsg(
    Ctx,
    "error",
    "Delivery Qty does not equal to SO Qty",
  );
  await tln.closeMsg(Ctx);
});