import { test, expect } from "./fixtures/custom-test";
import { PrismaClient } from "@prisma/client";
import prepareDBBeforeTest from "./helpers/prepareDBBeforeTest";

const options = ["GYMPOS", "MUNI", "TUKE"];

test.describe("Option Lists", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    const prisma = new PrismaClient();

    await prepareDBBeforeTest(prisma);

    await prisma.$disconnect();
  });

  test("can add a new option list", async ({ dashboardPage, page }) => {
    await dashboardPage.openOptionLists();
    await expect(page.getByText("No results")).toBeVisible();

    // Creating option list

    await dashboardPage.createNewOptionList({ name: "schools" });
    await dashboardPage.createNewOptionList({ name: "jobs" });
    await expect(page.getByText("No results")).not.toBeVisible();

    // Deleting option list
    await dashboardPage.deleteOptionList({ name: "jobs" });

    // Editing option list
    await dashboardPage.addOptionsToOptionList({ name: "schools", options });

    const option = options[0];
    const optionEdited = "edited";
    // Editing option
    await dashboardPage.editOption({
      option,
      newOption: optionEdited,
    });

    // Deleting option
    await dashboardPage.deleteOption({
      option: optionEdited,
    });

    await dashboardPage.createNewOption({ option });
  });

  test("can connect option list to form field", async ({
    dashboardPage,
    page,
  }) => {
    await dashboardPage.openFormEditor();
    await page.getByText("General info").click();
    await dashboardPage.createNewFormField({
      label: "What is your school?",
      type: "select",
      optionList: "schools",
      required: false,
    });
    await expect(
      page.getByRole("cell", {
        name: "What is your school?",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("cell", {
        name: "select",
      })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "schools" })).toBeVisible();
  });

  test("can fill the form with option list", async ({
    page,
    applicationPage,
  }) => {
    await applicationPage.openSignedIn();
    await page.getByText("General info").click();
    await page.getByLabel("Full name").fill("Test Testovic");
    await page.getByText("Select option").click();
    for (const option of options) {
      await expect(page.getByLabel(option).getByText(option)).toBeVisible();
    }
    await page.getByLabel(options[0]).getByText(options[0]).click();
    await page.getByRole("button", { name: "Save" }).click();
  });

  test("can create option list when creating form field", async ({
    dashboardPage,
    page,
  }) => {
    await dashboardPage.openFormEditor();
    await page.getByText("General info").click();
    await dashboardPage.createNewFormField({
      label: "What is your gender?",
      type: "radio",
      optionList: "(New empty option list)",
      newOptionListName: "genders",
      required: false,
    });

    await expect(
      page.getByRole("cell", {
        name: "What is your gender?",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("cell", {
        name: "radio",
      })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "genders" })).toBeVisible();

    await dashboardPage.openOptionLists();
    await expect(page.getByText("genders")).toBeVisible();
  });
});
