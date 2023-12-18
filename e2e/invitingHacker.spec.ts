import { test, expect } from "./fixtures/custom-test";
import { PrismaClient } from "@prisma/client";
import prepareDBBeforeTest from "./helpers/prepareDBBeforeTest";

test.describe("Invitations and review", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    const prisma = new PrismaClient();

    await prepareDBBeforeTest(prisma);

    await prisma.$disconnect();
  });

  test("organizer can setup vote parameters", async ({ page, dashboardPage }) => {
    await dashboardPage.openVoteParameters();

    await dashboardPage.createNewVoteParameter({
      name: "Test parameter",
      description: "Test description",
      minValue: 1,
      maxValue: 5,
      weight: 1,
    });
  });

  test("hacker can submit an application", async ({
    page,
    applicationPage,
  }) => {
    await applicationPage.openSignedIn();

    await expect(page.getByText("Application status: open")).toBeVisible();

    await page.getByText("General info").click();

    await expect(
      page.getByRole("heading", { name: "1. General info" })
    ).toBeVisible();
    await page.getByLabel("Full name").fill("Test Testovic");
    await page.getByRole("button", { name: "Save" }).click();

    await page.getByRole("button", { name: "Submit application" }).click();
    await expect(
      page.getByText(
        "Are you sure you want to submit your application? After submitting the application will be locked for changes. You can still join, create and manage your team."
      )
    ).toBeVisible();
    await page.getByRole("button", { name: "Yes" }).click();

    await expect(page.getByText("Application status: submitted")).toBeVisible();
  });

  test("organizer can review submitted application", async ({
    page,
    dashboardPage,
  }) => {
    await dashboardPage.openApplicationReview();
    await expect(page.getByText("Full name")).toBeVisible();
    await expect(page.getByText("Test Testovic")).toBeVisible();
    await expect(page.getByText("Test parameter")).toBeVisible();

    await page.getByRole("button", { name: "4" }).click();
    await page.getByRole("button", { name: "Save vote" }).click();

    await expect(
      page.getByText("No application left to review. Good job!")
    ).toBeVisible();

    await page.getByRole("link", { name: "Back to applications" }).click();
    await expect(
      page.getByRole("cell", { name: "Test Testovic" })
    ).toBeVisible();
    await expect(page.getByRole("cell", { name: "4" })).toBeVisible();
  });

  test("organizer can invite hacker", async ({ page, dashboardPage }) => {
    await expect(
      page.getByRole("heading", { name: "Applications" })
    ).toBeVisible();

    await expect(
      page.getByRole("cell", { name: "Test Testovic" })
    ).toBeVisible();
    await expect(page.getByRole("cell", { name: "submitted" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "4" })).toBeVisible();

    await expect(page.getByRole("button", { name: "Reject" })).toBeVisible();
    await page.getByRole("button", { name: "Invite" }).click();

    await expect(
      page.getByText(
        'Are you sure you want to invite hacker "test-hacker@test.com"?'
      )
    ).toBeVisible();
    await page.getByRole("button", { name: "Yes" }).click();
    await expect(page.getByRole("cell", { name: "invited" })).toBeVisible();
  });

  test("hacker can accept invitation", async ({ page, applicationPage }) => {
    await applicationPage.openSignedIn();
    await expect(page.getByText("Application status: invited")).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Decline attendance" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Confirm attendance" }).click();
    await expect(
      page.getByText("Are you sure you want to confirm attendance?")
    ).toBeVisible();
    await page.getByRole("button", { name: "Yes" }).click();
    await expect(page.getByText("Application status: confirmed")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Show checkin code" })
    ).toBeVisible();
  });
});
