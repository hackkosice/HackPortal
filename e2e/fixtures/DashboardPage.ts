import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class DashboardPage {
  constructor(public readonly page: Page) {}

  async goto() {
    await this.page.goto("/");

    await this.page.getByRole("link", { name: "Sign in" }).click();

    await this.page.fill('input[name="email"]', "test-org@hackkosice.com");
    await this.page.fill('input[name="password"]', "test123");

    await this.page.getByRole("button", { name: /^Sign in$/ }).click();

    await this.page.waitForTimeout(2000);
  }

  async openFormEditor() {
    await this.page
      .getByRole("link", { name: "Edit application form" })
      .click();

    await expect(
      this.page.getByRole("heading", { name: "Application Form Editor" })
    ).toBeVisible();

    await this.page.waitForTimeout(2000);
  }

  async openOptionLists() {
    await this.page.getByRole("link", { name: "Manage option lists" }).click();

    await expect(
      this.page.getByRole("heading", { name: "Option Lists Manager" })
    ).toBeVisible();

    // await this.page.waitForTimeout(2000);
  }

  async signOut() {
    await this.page.getByRole("button", { name: "Sign out" }).click();

    await expect(
      this.page.getByRole("heading", { name: "Sign in" })
    ).toBeVisible();
  }
}
