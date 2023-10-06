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

    await page.getByRole("button", { name: "Start application" }).click();

    await expect(
      page.getByRole("heading", {
        name: "Welcome to Hack Kosice Application portal!",
      })
    ).toBeVisible();

    await expect(page.getByText("You are not signed in")).toBeVisible();
  });

  test("can login and logout as hacker", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await page.fill('input[name="email"]', "test-hacker@test.com");
    await page.fill('input[name="password"]', "test123");
    await page.getByRole("button", { name: /^Sign in$/ }).click();

    await expect(
      page.getByRole("heading", {
        name: "Welcome to Hack Kosice Application portal!",
      })
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Sign in" })
    ).not.toBeVisible();
    await page.getByRole("button", { name: "Sign out" }).click();

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });

  test("can login and logout as organizer", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await page.fill('input[name="email"]', "test-org@hackkosice.com");
    await page.fill('input[name="password"]', "test123");
    await page.getByRole("button", { name: /^Sign in$/ }).click();

    await expect(
      page.getByRole("heading", {
        name: "Dashboard Organizer",
      })
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Sign in" })
    ).not.toBeVisible();
    await page.getByRole("button", { name: "Sign out" }).click();

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });
});
