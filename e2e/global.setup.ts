import { test as setup, expect } from "@playwright/test";

import { STORAGE_STATE } from "../playwright.config";

setup("global setup", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Accept all" }).click();
  await expect(page.getByText("Cookie consent")).not.toBeVisible();
  await page.context().storageState({ path: STORAGE_STATE });
});
