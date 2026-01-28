import { test } from "@playwright/test";
import { TalonBase } from "./utils/talon_base";

test("T200-C01 | Create Quotation (3 Months Pattern)", async ({ page }) => {
  const testId = "T200-C01";
  const tln = new TalonBase(page);

  // Login
  await tln.login();

  // Navigate to Create Quotation (Press)
  const Ctx = await tln.navigate(
    "Sale Order (Press)",
    "Create Quotation (Press)",
    testId
  );

  /* =========================
     2) Input Customer
     ========================= */
  const custPage = await tln.openPopup(Ctx, "#TLN_1_I_CSCODE_SUB");
  await custPage.locator('input[name="R_ROW:0:j_idt96"]').click();

  await tln.stepScreenshot(Ctx, testId, 2, "Input_Customer");

  /* =========================
     3) Input Pattern = 3 Months
     ========================= */
  await Ctx.locator("#TLN_1_I_TYPE").selectOption("0");
  await tln.stepScreenshot(Ctx, testId, 3, "Input_Pattern_3_Months");

  /* =========================
     4) Input PIC
     ========================= */
  const picPage = await tln.openPopup(Ctx, "#TLN_1_I_PIC_SUB");
  await picPage.locator('input[name="R_ROW:4:j_idt96"]').click();

  await tln.stepScreenshot(Ctx, testId, 4, "Input_PIC");

  /* =========================
     5) Select Exchange Rate Type
     ========================= */
  await Ctx.locator("#TLN_1_I_EXG_RATE_TYPE").selectOption("2");
  await tln.stepScreenshot(Ctx, testId, 5, "Select_Exchange_Rate_Type");

  /* =========================
     6) Click Get FG Details
     ========================= */
  await tln.clickButton(Ctx, "Get FG Details");
  await tln.stepScreenshot(Ctx, testId, 6, "Get_FG_Details");

  /* =========================
     7) Submit
     ========================= */
  await tln.clickButton(Ctx, "Submit");
  await tln.stepScreenshot(Ctx, testId, 7, "Submit");

  /* =========================
     8) Verify success message
     ========================= */
  await tln.expectMsg(Ctx, "info", "Successfully Submitted");
  await tln.stepScreenshot(Ctx, testId, 8, "Message dialog");

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
  const Ctx2 = await tln.openPopup(
    Ctx,
    'input[name="2_Issue Sales Order_0"]',
  );

  // input data in the Box Details
  await Ctx2.locator("#TLN_1_I_DLYDATE_flatpickr_btn").click();
  await Ctx2.getByLabel("January 29,").nth(1).click();
  await Ctx2.locator("#TLN_1_I_DLYDATE").fill("01/29/2026");
  await Ctx2.locator("input[id='TLN_2_I_QTY_0']").fill("10");
  await Ctx2.locator("input[id='TLN_2_I_QTY_1']").fill("2");
  await Ctx2.locator("input[id='TLN_2_I_QTY_2']").fill("12");

  await tln.clickButton(Ctx2, "Save");
  await tln.expectMsg(Ctx2, "info", "Successfully Submitted");
});

test("Sales Order List (Press)", async ({ page }) => {
  let tln = new TalonBase(page);
  await tln.login();
  //await tln.screenshot(page, "01_after_login");

  const Ctx = await tln.navigate(
    "Sale Order (Press)",
    "Sales Order List (Press)",
  );
  //await tln.screenshot(Ctx, "02_open_sales_order_list");

  // Cancel
  await tln.selectCheckbox(Ctx);
 // await tln.screenshot(Ctx, "03_checkbox_selected");

  await tln.clickButton(Ctx, "Cancel");
  //await tln.screenshot(Ctx, "04_click_cancel");

  await tln.expectMsg(Ctx, "error", "SO Detail is already cancelled");
  //await tln.screenshot(Ctx, "05_cancel_error_msg");

  await tln.closeMsg(Ctx);

  // Close SO
  await tln.selectCheckbox(Ctx);
  //await tln.screenshot(Ctx, "06_checkbox_selected_again");

  await tln.clickButton(Ctx, "Close SO", true);
  //await tln.screenshot(Ctx, "07_click_close_so");

  await tln.expectMsg(Ctx, "error", "SO Detail is already cancelled");
  //await tln.screenshot(Ctx, "08_close_so_error_msg");

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