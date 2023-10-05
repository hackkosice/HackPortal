import { test, expect } from "@playwright/test";

test("has basic content", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(
    page.getByText("Welcome to application portal for Hack Kosice 2023!")
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Start application" })
  ).toBeVisible();
});
