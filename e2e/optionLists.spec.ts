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

    await page.getByRole("button", { name: "Add new list" }).click();

    await expect(
      page.getByRole("heading", { name: "Create new option list" })
    ).toBeVisible();

    await page.getByLabel("Option list name").fill("schools");

    await page.getByRole("button", { name: "Create" }).click();

    await expect(page.getByText("No results")).not.toBeVisible();
    await expect(page.getByText("schools")).toBeVisible();

    await page.getByRole("button", { name: "Add new list" }).click();
    await page.getByLabel("Option list name").fill("jobs");
    await page.getByRole("button", { name: "Create" }).click();

    await expect(page.getByText("jobs")).toBeVisible();

    // Deleting option list
    await page
      .getByRole("button", { name: "Open menu jobs option list" })
      .click();

    await page.getByRole("menuitem", { name: "Delete" }).click();

    await expect(
      page.getByText('Are you sure you want to delete option list "jobs"?')
    ).toBeVisible();

    await page.getByRole("button", { name: "No" }).click();

    await expect(page.getByText("jobs", { exact: true })).toBeVisible();

    await page
      .getByRole("button", { name: "Open menu jobs option list" })
      .click();

    await page.getByRole("menuitem", { name: "Delete" }).click();

    await expect(
      page.getByText('Are you sure you want to delete option list "jobs"?')
    ).toBeVisible();

    await page.getByRole("button", { name: "Yes" }).click();

    await expect(page.getByText("jobs", { exact: true })).not.toBeVisible();

    // Editing option list
    await page
      .getByRole("button", { name: "Open menu schools option list" })
      .click();
    await page.getByRole("menuitem", { name: "Edit list" }).click();

    // Adding options
    await expect(
      page.getByRole("heading", { name: "Option List Editor" })
    ).toBeVisible();
    await expect(page.getByText("No results")).toBeVisible();

    for (const option of options) {
      await page.getByRole("button", { name: "Add new option" }).click();
      await expect(
        page.getByRole("heading", { name: "Create new option" })
      ).toBeVisible();

      await page.getByLabel("Option value").fill(option);
      await page.getByRole("button", { name: "Create" }).click();
    }

    await expect(page.getByText("No results")).not.toBeVisible();
    for (const option of options) {
      await expect(page.getByText(option)).toBeVisible();
    }

    const option = options[0];
    const optionEdited = "edited";
    // Editing option
    await page
      .getByRole("button", { name: `Open menu option ${option}` })
      .click();
    await page.getByRole("menuitem", { name: "Edit option" }).click();

    await expect(
      page.getByRole("heading", { name: "Edit option" })
    ).toBeVisible();

    await expect(page.getByLabel("Option value")).toHaveValue(option);
    await page.getByLabel("Option value").fill(optionEdited);
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText(optionEdited)).toBeVisible();
    await expect(page.getByText(option)).not.toBeVisible();

    // Deleting option
    await page
      .getByRole("button", { name: `Open menu option ${optionEdited}` })
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();

    await expect(
      page.getByText(
        `Are you sure you want to delete option "${optionEdited}"?`
      )
    ).toBeVisible();

    await page.getByRole("button", { name: "No" }).click();

    await expect(page.getByText(optionEdited, { exact: true })).toBeVisible();

    await page
      .getByRole("button", { name: `Open menu option ${optionEdited}` })
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();

    await expect(
      page.getByText(
        `Are you sure you want to delete option "${optionEdited}"?`
      )
    ).toBeVisible();

    await page.getByRole("button", { name: "Yes" }).click();

    await expect(
      page.getByText(optionEdited, { exact: true })
    ).not.toBeVisible();

    await page.getByRole("button", { name: "Add new option" }).click();
    await page.getByLabel("Option value").fill(option);
    await page.getByRole("button", { name: "Create" }).click();

    await expect(page.getByText(option)).toBeVisible();
  });

  test("can connect option list to form field", async ({
    dashboardPage,
    page,
  }) => {
    await dashboardPage.openFormEditor();
    await page.getByText("General info").click();
    await page.getByRole("button", { name: "Create new field" }).click();

    await page.getByLabel("Label").fill("What is your school?");
    await page.getByText("Select a field type").click();
    await page.getByLabel("select").getByText("select").click();
    await expect(page.getByLabel("Connected option list")).toBeVisible();
    await page.getByText("Select an option list").click();
    await page.getByLabel("schools").getByText("schools").click();

    await page.getByRole("button", { name: "Save new field" }).click();

    await expect(
      page.getByRole("heading", { name: "Add new field" })
    ).not.toBeVisible();
    await expect(page.getByText("What is your school?")).toBeVisible();
    await expect(page.getByText("select")).toBeVisible();
    await expect(page.getByRole("link", { name: "schools" })).toBeVisible();
  });

  test("can fill the form with option list", async ({
    page,
    applicationPage,
  }) => {
    applicationPage.openSignedIn();
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
    await page.getByRole("button", { name: "Create new field" }).click();

    await page.getByLabel("Label").fill("What is your gender?");
    await page.getByText("Select a field type").click();
    await page.getByLabel("radio").getByText("radio").click();
    await expect(page.getByLabel("Connected option list")).toBeVisible();
    await page.getByText("Select an option list").click();
    await page
      .getByLabel("(New empty option list)")
      .getByText("(New empty option list)")
      .click();
    await expect(page.getByLabel("New option list name")).toBeVisible();
    await page.getByLabel("New option list name").fill("genders");

    await page.getByRole("button", { name: "Save new field" }).click();

    await expect(
      page.getByRole("heading", { name: "Add new field" })
    ).not.toBeVisible();
    await expect(page.getByText("What is your gender?")).toBeVisible();
    await expect(page.getByText("radio")).toBeVisible();
    await expect(page.getByRole("link", { name: "genders" })).toBeVisible();

    await dashboardPage.openOptionLists();
    await expect(page.getByText("genders")).toBeVisible();
  });
});
