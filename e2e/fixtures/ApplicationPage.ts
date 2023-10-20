import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class ApplicationPage {
  constructor(public readonly page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  async openSignedIn() {
    await this.page.getByRole("link", { name: "Sign in" }).click();

    await this.page.fill('input[name="email"]', "test-hacker@test.com");
    await this.page.fill('input[name="password"]', "test123");

    await this.page.getByRole("button", { name: /^Sign in$/ }).click();
  }

  async openUnsigned() {
    await this.page.getByRole("link", { name: "Start application" }).click();
  }
}
