import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import prepareDBBeforeTest from "./helpers/prepareDBBeforeTest";

test.describe("smoke tests", () => {
  test.beforeAll(async () => {
    const prisma = new PrismaClient();

    await prepareDBBeforeTest(prisma);

    await prisma.$disconnect();
  });

  test("can start application without signing in", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Start application" }).click();

    await expect(
      page.getByRole("heading", {
        name: "Your application for Hack Kosice TEST",
      })
    ).toBeVisible();

    await expect(page.getByText("You are not signed in")).toBeVisible();
  });

  test("can sign in and sign out as hacker", async ({ page, isMobile }) => {
    await page.goto("/");

    if (isMobile) {
      await page.getByRole("button", { name: "open menu" }).click();
    }
    await page.getByRole("link", { name: "Sign in" }).click();

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await page.fill('input[name="email"]', "test-hacker@test.com");
    await page.fill('input[name="password"]', "test123456");
    await page.getByRole("button", { name: /^Sign in$/ }).click();

    await expect(
      page.getByRole("heading", {
        name: "Your application for Hack Kosice TEST",
      })
    ).toBeVisible();

    if (isMobile) {
      await page.getByRole("button", { name: "open menu" }).click();
    }
    await expect(page.getByRole("link", { name: "Sign in" })).not.toBeVisible();
    await page
      .getByRole(isMobile ? "menuitem" : "button", { name: "Sign out" })
      .click();

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });

  test("can sign in and sign out as organizer", async ({ page, isMobile }) => {
    await page.goto("/");

    if (isMobile) {
      await page.getByRole("button", { name: "open menu" }).click();
    }
    await page.getByRole("link", { name: "Sign in" }).click();

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await page.fill('input[name="email"]', "test-org@hackkosice.com");
    await page.fill('input[name="password"]', "test123456");
    await page.getByRole("button", { name: /^Sign in$/ }).click();

    await expect(
      page.getByRole("heading", {
        name: "Dashboard",
      })
    ).toBeVisible();

    if (isMobile) {
      await page.getByRole("button", { name: "open menu" }).click();
    }
    await expect(page.getByRole("link", { name: "Sign in" })).not.toBeVisible();
    await page
      .getByRole(isMobile ? "menuitem" : "button", { name: "Sign out" })
      .click();

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });
});
