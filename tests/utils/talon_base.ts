// utils/talon_base.ts
import { expect, Page } from "@playwright/test";

// ==============================
// Config
// ==============================
export const CONFIG = {
  url: "https://sandbox-dev-talon.bright-better.com/Talon/",
  user: "demo",
  pass: "test123",
};

const MSG = {
  Err: "li.tln-message.message-error.message-error-icon",
  Info: "li.tln-message.message-info",
};

export class TalonBase {
  constructor(public page: Page) {}

  // ==============================
  // Screenshot helpers
  // ==============================
  async stepScreenshot(page: Page, testId: string, stepNo: number, name: string) {
    const safeName = name.replace(/[^a-zA-Z0-9-_]/g, "_");
    const step = String(stepNo).padStart(2, "0");

    await page.screenshot({
      path: `screenshots/${testId}/${step}_${safeName}.png`,
      fullPage: true,
    });
  }

  // ==============================
  // Auth
  // ==============================
  async login() {
    await this.page.goto(CONFIG.url);
    await this.page.locator("#user_id").fill(CONFIG.user);
    await this.page.getByRole("textbox", { name: "PASSWORD" }).fill(CONFIG.pass);
    await this.page.getByRole("button", { name: "LOGIN" }).click();
    await this.page.waitForLoadState("networkidle");
  }

  // ==============================
  // Navigation (menu → popup)
  // ==============================
  async navigate(
    funcGroup: string | RegExp,
    menuItem: string | RegExp,
    testId?: string
  ): Promise<Page> {
    await this.page.locator("a").filter({ hasText: funcGroup }).click();

    const popupPromise = this.page.waitForEvent("popup");
    await this.page.locator("a").filter({ hasText: menuItem }).click();

    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");

    // Screenshot immediately after open Create Quotation
    if (testId) {
      await this.stepScreenshot(
        popup,
        testId,
        1,
        "Open_Create_Quotation_Press"
      );
    }

    return popup;
  }

  // ==============================
  // Open popup from screen
  // ==============================
  async openPopup(parentPage: Page, selector: string): Promise<Page> {
    const btn = parentPage.locator(selector);
  
    await btn.waitFor({ state: "visible" });
  
    const popupPromise = parentPage.waitForEvent("popup");
  
    await btn.click({ force: true });
  
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
  
    return popup;
  }


  // ==============================
  // Message dialog
  // ==============================
  async expectMsg(page: Page, type: "info" | "error", text: string) {
    const selector = type === "info" ? MSG.Info : MSG.Err;
    await expect(page.locator(selector, { hasText: text })).toBeVisible();
  }

  async closeMsg(page: Page) {
    await page
      .getByRole("dialog", { name: "Message" })
      .getByLabel("Close")
      .click();
  }

  // ==============================
  // Common Actions
  // ==============================
  async selectCheckbox(page: Page, index: number = 0) {
    if (index === 0) {
      await page.locator(".checkbox_label").first().click();
    } else {
      await page.locator(".checkbox_label").nth(index).click();
    }
  }

  async clickButton(page: Page, buttonName: string, exact: boolean = false) {
    if (exact) {
      await page
        .getByRole("button", { name: buttonName, exact: true })
        .first()
        .click();
    } else {
      await page.getByRole("button", { name: buttonName }).click();
    }
  }
}
