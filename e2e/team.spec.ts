import { test, expect } from "./fixtures/custom-test";
import { PrismaClient } from "@prisma/client";
import prepareDBBeforeTest from "./helpers/prepareDBBeforeTest";

let teamCode = "";

test.describe("Team", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    const prisma = new PrismaClient();

    await prepareDBBeforeTest(prisma, {
      numberOfHackers: 2,
    });

    await prisma.$disconnect();
  });

  test("unsigned user cannot create a team", async ({
    page,
    applicationPage,
  }) => {
    await applicationPage.openUnsigned();

    await expect(
      page.getByRole("heading", { name: "Your team" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Create new team" })
    ).toBeDisabled();

    await expect(
      page.getByRole("button", { name: "Join existing team" })
    ).toBeDisabled();
  });

  test("signed in hacker can create a team", async ({
    page,
    applicationPage,
  }) => {
    await applicationPage.openSignedIn();

    await expect(
      page.getByRole("heading", { name: "Your team" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Create new team" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Join existing team" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Create new team" }).click();

    await expect(
      page.getByRole("heading", { name: "Create new team" })
    ).toBeVisible();
    await page.getByLabel("Team name").fill("Best team");
    await page.getByRole("button", { name: "Create" }).click();

    await expect(page.getByText("Team name:")).toBeVisible();
    await expect(page.getByText("Best team")).toBeVisible();
    await expect(page.getByText("Team members (1/4):")).toBeVisible();
    await expect(page.getByText("test-hacker@test.com (owner)")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Leave team" })
    ).not.toBeVisible();

    // Editing team name
    await page.getByRole("button", { name: "Edit team name" }).click();
    await expect(
      page.getByRole("heading", { name: "Edit team name" })
    ).toBeVisible();
    await expect(page.getByLabel("Team name", { exact: true })).toHaveValue(
      "Best team"
    );
    await page.getByLabel("Team name", { exact: true }).fill("Test team");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Team name:")).toBeVisible();
    await expect(page.getByText("Test team")).toBeVisible();
    await expect(page.getByText("Best team")).not.toBeVisible();

    // Copying team code
    await page.getByRole("button", { name: "Copy team code" }).click();
    teamCode = await page.evaluate("navigator.clipboard.readText()");
    expect(teamCode).not.toBe("");
  });

  test("signed in hacker can join a team", async ({
    page,
    applicationPage,
  }) => {
    await applicationPage.openSignedIn({ hackerIndex: 2 });

    await expect(
      page.getByRole("heading", { name: "Your team" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Join existing team" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Join existing team" }).click();

    await expect(
      page.getByRole("heading", { name: "Join existing team" })
    ).toBeVisible();
    await page.getByLabel("Team code").fill(teamCode);
    await page.getByRole("button", { name: "Join" }).click();

    await expect(page.getByText("Team name:")).toBeVisible();
    await expect(page.getByText("Test team")).toBeVisible();
    await expect(page.getByText("Team members (2/4):")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Leave team" })
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "test-hacker@test.com (owner)" })
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "test-hacker-2@test.com" })
    ).toBeVisible();
    await expect(page.getByText("Kick")).not.toBeVisible();
  });

  test("owner can kick a team member", async ({ page, applicationPage }) => {
    await applicationPage.openSignedIn();

    await expect(page.getByText("Team members (2/4):")).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "test-hacker-2@test.com" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Kick" }).click();
    await expect(
      page.getByText("Are you sure you want to kick test-hacker-2@test.com?")
    ).toBeVisible();
    await page.getByRole("button", { name: "No" }).click();

    await expect(
      page.getByText("Are you sure you want to kick test-hacker-2@test.com?")
    ).not.toBeVisible();

    await expect(page.getByText("Team members (2/4):")).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "test-hacker-2@test.com" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Kick" }).click();
    await expect(
      page.getByText("Are you sure you want to kick test-hacker-2@test.com?")
    ).toBeVisible();
    await page.getByRole("button", { name: "Yes" }).click();

    await expect(page.getByText("Team members (1/4):")).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "test-hacker-2@test.com" })
    ).not.toBeVisible();
  });

  test("member can leave a team", async ({ page, applicationPage }) => {
    await applicationPage.openSignedIn({ hackerIndex: 2 });

    await page.getByRole("button", { name: "Join existing team" }).click();
    await page.getByLabel("Team code").fill(teamCode);
    await page.getByRole("button", { name: "Join" }).click();

    await expect(page.getByText("Test team")).toBeVisible();

    await page.getByRole("button", { name: "Leave team" }).click();
    await expect(
      page.getByText("Are you sure you want to leave this team?")
    ).toBeVisible();
    await page.getByRole("button", { name: "No" }).click();

    await expect(page.getByText("Test team")).toBeVisible();

    await page.getByRole("button", { name: "Leave team" }).click();
    await expect(
      page.getByText("Are you sure you want to leave this team?")
    ).toBeVisible();
    await page.getByRole("button", { name: "Yes" }).click();

    await expect(page.getByText("Test team")).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "Join existing team" })
    ).toBeVisible();
  });

  test("hacker can join a team after submitting application", async ({
    page,
    applicationPage,
  }) => {
    await applicationPage.openSignedIn({ hackerIndex: 2 });

    await expect(page.getByText("Application status: open")).toBeVisible();

    await page.getByText("General info").click();
    await expect(
      page.getByRole("heading", { name: "General info" })
    ).toBeVisible();
    await page.getByLabel("Full name").fill("Test Hacker 2");
    await page.getByRole("button", { name: "Save" }).click();

    await page.getByRole("button", { name: "Submit application" }).click();
    await page.getByRole("button", { name: "Yes" }).click();
    await expect(page.getByText("Application status: submitted")).toBeVisible();

    await page.getByRole("button", { name: "Join existing team" }).click();
    await page.getByLabel("Team code").fill(teamCode);
    await page.getByRole("button", { name: "Join" }).click();

    await expect(page.getByText("Test team")).toBeVisible();
  });
});
