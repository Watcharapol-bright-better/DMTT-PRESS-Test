import { expect, Page } from "@playwright/test";

// Config
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

  // Auth
  async login() {
    await this.page.goto(CONFIG.url);
    await this.page.locator("#user_id").fill(CONFIG.user);
    await this.page.getByRole("textbox", { name: "PASSWORD" }).fill(CONFIG.pass);
    await this.page.getByRole("button", { name: "LOGIN" }).click();
  }

  // Navigation
  async navigate(funcGroup: string | RegExp, menuItem: string | RegExp): Promise<Page> {
    await this.page.locator("a").filter({ hasText: funcGroup }).click();
    const popupPromise = this.page.waitForEvent("popup");
    await this.page.locator("a").filter({ hasText: menuItem }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    return popup;
  }


  // Popup new screen 
  async openPopup(parentPage: Page, selector: string) : Promise<Page> {
    const popupPromise = parentPage.waitForEvent("popup");
    await parentPage.locator(selector).click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    return popup;
  }

  // Message dialog
  async expectMsg(page: Page, type: "info" | "error", text: string) {
    const selector = type === "info" ? MSG.Info : MSG.Err;
    await expect(page.locator(selector, { hasText: text })).toBeVisible();
  }

  async closeMsg(page: Page) {
    await page.getByRole("dialog", { name: "Message" }).getByLabel("Close").click();
  }

  // Common Actions
  async selectCheckbox(page: Page, index: number = 0) {
    if (index === 0) {
      await page.locator(".checkbox_label").first().click();
    } else {
      await page.locator(".checkbox_label").nth(index).click();
    }
  }

  async clickButton(page: Page, buttonName: string, exact: boolean = false) {
    if (exact) {
      await page.getByRole("button", { name: buttonName, exact: true }).first().click();
    } else {
      await page.getByRole("button", { name: buttonName }).click();
    }
  }

}