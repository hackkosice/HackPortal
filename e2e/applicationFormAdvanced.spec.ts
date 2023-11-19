/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from "./fixtures/custom-test";
import { PrismaClient } from "@prisma/client";
import prepareDBBeforeTest from "./helpers/prepareDBBeforeTest";

test.describe("application form", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    const prisma = new PrismaClient();

    await prepareDBBeforeTest(prisma);

    await prisma.$disconnect();
  });

  test("can create application form field with visibility rule", async ({
    page,
    dashboardPage,
  }) => {
    await dashboardPage.openOptionLists();
    await dashboardPage.createNewOptionList({ name: "yesno" });
    await dashboardPage.addOptionsToOptionList({
      name: "yesno",
      options: ["Yes", "No"],
    });
    await page
      .getByRole("link", {
        name: "Back to option lists",
      })
      .click();
    await page
      .getByRole("link", {
        name: "Back to Dashboard",
      })
      .click();
    await dashboardPage.openFormEditor();
    await page.getByRole("button", { name: "Create new step" }).click();
    await page.getByText("Step #2").click();

    await dashboardPage.editStepInfo({
      title: "Experience",
      description: "Experience - description",
    });
    await dashboardPage.createNewFormField({
      label: "Have you ever been to a hackathon?",
      type: "radio",
      optionList: "yesno",
      required: true,
    });
    await dashboardPage.createNewFormField({
      label: "If yes, which one?",
      type: "textarea",
      required: false,
      visibilityRule: {
        targetField: "Have you ever been to a hackathon?",
        targetOption: "Yes",
      },
    });
  });

  test("can fill out application form with visibility rule", async ({
    page,
    applicationPage,
  }) => {
    await applicationPage.openSignedIn();

    await page.getByText("Experience").click();
    await expect(
      page.getByRole("heading", { name: "Experience" })
    ).toBeVisible();
    await expect(
      page.getByText("Have you ever been to a hackathon?")
    ).toBeVisible();
    await expect(page.getByLabel("If yes, which one?")).not.toBeVisible();
    await page.getByText("No", { exact: true }).click();
    await expect(page.getByLabel("If yes, which one?")).not.toBeVisible();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Application status: open")).toBeVisible();

    await page.getByText("Experience").click();
    await expect(
      page.getByText("Have you ever been to a hackathon?")
    ).toBeVisible();
    await expect(page.getByLabel("If yes, which one?")).not.toBeVisible();
    await page.getByText("Yes", { exact: true }).click();
    await expect(page.getByLabel("If yes, which one?")).toBeVisible();
    await page.getByLabel("If yes, which one?").fill("Hack Kosice");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Application status: open")).toBeVisible();

    await page.getByText("Experience").click();
    await expect(
      page.getByText("Have you ever been to a hackathon?")
    ).toBeVisible();
    await expect(page.getByLabel("If yes, which one?")).toBeVisible();
    await expect(page.getByLabel("If yes, which one?")).toHaveValue(
      "Hack Kosice"
    );
  });
});
