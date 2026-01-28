import { test } from "@playwright/test";
import { TalonBase } from "./utils/talon_base";

// Create Quotation (Press)
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
