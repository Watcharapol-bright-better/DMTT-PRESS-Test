import { test, expect } from "@playwright/test";
import { TalonBase } from "./utils/talon_base";


function subtractMonths(mmYYYY: string, monthsToSubtract: number): string {
  console.log("subtractMonths called with:", mmYYYY, monthsToSubtract);
  const [mm, yyyy] = mmYYYY.split("/").map(Number);

  let month = mm - monthsToSubtract;
  let year = yyyy;

  while (month <= 0) {
    month += 12;
    year -= 1;
  }

  const resultMM = String(month).padStart(2, "0");
  return `${resultMM}/${year}`;
}


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

  // 2) Input Customer
  const custPage = await tln.openPopup(Ctx, "#TLN_1_I_CSCODE_SUB");
  await custPage.locator('input[name="R_ROW:0:j_idt96"]').click();
  await tln.stepScreenshot(Ctx, testId, 2, "Input_Customer");

  
  //  3) Input PIC
  const picPage = await tln.openPopup(Ctx, "#TLN_1_I_PIC_SUB");
  await picPage.locator('input[name="R_ROW:4:j_idt96"]').click();
  await tln.stepScreenshot(Ctx, testId, 3, "Input_PIC");

  
  //  4) Input Pattern = 3 Months
  await Ctx.locator("#TLN_1_I_TYPE").selectOption("0");
  await tln.stepScreenshot(Ctx, testId, 4, "Input_Pattern_3_Months");
  
  
  // 5) Click Get FG Details
  await tln.clickButton(Ctx, "Get FG Details");
  await tln.stepScreenshot(Ctx, testId, 5, "Get_FG_Details");
  
  
  // 6) Verify QT Month - 3 Months = Metal Price Month
  // const qtMonth = await Ctx.locator("#TLN_1_I_QT_MTH").inputValue();
  // console.log("QT Month =", qtMonth);
  // const expectedMetalMonth = subtractMonths(qtMonth, 3);
  // console.log("Expected Metal Price Month =", expectedMetalMonth);
  // const metalPriceMonth = await Ctx.locator('#TLN_1_I_METAL_PRICE').inputValue();
  // console.log("Metal Price Month =", metalPriceMonth);
  // expect(metalPriceMonth).toBe(expectedMetalMonth);
  // await tln.stepScreenshot(
  //   Ctx,
  //   testId,
  //   6,
  //   "Verify_QT_Month"
  // );
  
  
  // 6) Submit
  await tln.clickButton(Ctx, "Submit");
  await tln.stepScreenshot(Ctx, testId, 6, "Submit");

  // 7) Verify success message
  await tln.expectMsg(Ctx, "info", "Successfully Submitted");
  await tln.stepScreenshot(Ctx, testId, 7, "Message dialog");

});


test("T200-C01-E01 | Create Quotation (3 Months Pattern) - No Material Quotation Information Found", async ({ page }) => {
  const testId = "T200-C01-E01";
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
     1) Input Customer
     ========================= */
  const custPage = await tln.openPopup(Ctx, "#TLN_1_I_CSCODE_SUB");
  await custPage.locator('input[name="R_ROW:11:j_idt96"]').click();

  await tln.stepScreenshot(Ctx, testId, 2, "Input_Customer");

  /* =========================
     2) Input Pattern = 3 Months
     ========================= */
  await Ctx.locator("#TLN_1_I_TYPE").selectOption("0");
  await tln.stepScreenshot(Ctx, testId, 3, "Input_Pattern_3_Months");

  /* =========================
     3) Input PIC
     ========================= */
  const picPage = await tln.openPopup(Ctx, "#TLN_1_I_PIC_SUB");
  await picPage.locator('input[name="R_ROW:4:j_idt96"]').click();

  await tln.stepScreenshot(Ctx, testId, 4, "Input_PIC");


  /* =========================
     4) Click Get FG Details
     ========================= */
  await tln.clickButton(Ctx, "Get FG Details");
  await tln.stepScreenshot(Ctx, testId, 5, "Get_FG_Details");
  
  /* =========================
     5) Expect Error Message
     ========================= */
  await tln.expectMsg(Ctx, "error", "Material price not found");
  await tln.stepScreenshot(Ctx, testId, 6, "Expect_Error_Message");
  
} );
