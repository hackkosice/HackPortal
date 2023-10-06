import { test, expect } from "@playwright/test";

test("can login", async ({ page }) => {
  await page.goto("/");

  await page.click('button:has-text("Log in")');

  await page.fill('input[name="email"]', "test-hacker@test.com");
  await page.fill('input[name="password"]', "test123");

  await page.getByRole("button", { name: "Log in" }).click();

  await expect(
    page.getByText("Welcome to Hack Kosice Application portal!")
  ).toBeVisible();

  await expect(page.getByRole("button", { name: "Log in" })).not.toBeVisible();
});
