import type { Page } from "@playwright/test";

export class ApplicationPage {
  constructor(public readonly page: Page, public readonly isMobile: boolean) {}

  async goto() {
    await this.page.goto("/");
  }

  async openSignedIn(
    { hackerIndex }: { hackerIndex: number } = { hackerIndex: 1 }
  ) {
    if (this.isMobile) {
      await this.page.getByRole("button", { name: "open menu" }).click();
    }
    await this.page.getByRole("link", { name: "Sign in" }).click();

    if (hackerIndex > 1) {
      await this.page.fill(
        'input[name="email"]',
        `test-hacker-${hackerIndex}@test.com`
      );
      await this.page.fill('input[name="password"]', "test123");
    } else {
      await this.page.fill('input[name="email"]', "test-hacker@test.com");
      await this.page.fill('input[name="password"]', "test123");
    }

    await this.page.getByRole("button", { name: /^Sign in$/ }).click();
  }

  async openUnsigned() {
    await this.page.getByRole("link", { name: "Start application" }).click();
  }
}
