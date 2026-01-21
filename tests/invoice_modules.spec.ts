import { test, expect, Page } from "@playwright/test";
import { TalonBase } from "./utils/talon_base";

test("Create Shipment Instruction (Press)", async ({ page }) => {
  let tln = new TalonBase(page);
  await tln.login();
  const popup = await tln.navigate(
    "Invoice (Press)",
    "Create Shipment Instruction (Press)",
  );
});
