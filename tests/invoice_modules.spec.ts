import { test } from "@playwright/test";
import { TalonBase } from "./utils/talon_base";

test("Create Shipment Instruction (Press)", async ({ page }) => {
  let tln = new TalonBase(page);
  await tln.login();
  const Ctx = await tln.navigate(
    /^Invoice \(Press\)$/,
    "Create Shipment Instruction",
  );

  // Open Customer Subform
  const custPage = await tln.openPopup(Ctx, "#TLN_1_I_CSCODE_SUB");
  await custPage.locator('input[name="R_ROW:9:j_idt96"]').click();

  // Select Date Picker
  await Ctx.locator("#TLN_1_I_SHIP_DLY_DATE_flatpickr_btn").click();
  await Ctx.getByLabel("January 21,").nth(1).click();
  await Ctx.locator("#TLN_1_I_SHIP_DLY_DATE").fill("01/21/2026");

  // Open Ship to Subform
  const shipToPage = await tln.openPopup(Ctx, "#TLN_1_I_SHIPTO_SUB");
  await shipToPage.locator('input[name="R_ROW:4:j_idt96"]').click();

  // Fetch data and submit
  await tln.clickButton(Ctx, "Check DO");
  await tln.clickButton(Ctx, "Submit");
  await tln.expectMsg(Ctx, "info", 'Successfully Submitted');
});
