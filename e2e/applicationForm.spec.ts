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

  test("editing application form", async ({ page, dashboardPage }) => {
    await dashboardPage.openFormEditor();

    await expect(page.getByText("General info")).toBeVisible();

    // Creating and deleting steps

    await page.getByRole("button", { name: "Create new step" }).click();

    await expect(page.getByText("Step #2")).toBeVisible();

    await page.getByRole("button", { name: "Create new step" }).click();

    await expect(page.getByText("Step #3")).toBeVisible();

    await page.getByRole("button", { name: "Delete step 3" }).click();

    await expect(page.getByText("Step #3")).not.toBeVisible();

    // Editing step
    await page.getByText("Step #2").click();

    await page.waitForTimeout(2000);

    await expect(page.getByRole("heading", { name: "Step #2" })).toBeVisible();

    await page.getByRole("button", { name: "Edit info" }).click();

    await page.getByLabel("Step title").fill("Experience");
    await page.getByLabel("Description").fill("Experience - description");

    await page.getByRole("button", { name: "Save" }).click();

    await expect(
      page.getByRole("heading", { name: "Experience" })
    ).toBeVisible();

    await expect(page.getByText("Experience - description")).toBeVisible();

    // Adding new fields
    await page.getByRole("button", { name: "Create new field" }).click();

    await expect(
      page.getByRole("heading", { name: "Add new field" })
    ).toBeVisible();

    await page
      .getByLabel("Label")
      .fill("What is your experience with hackathons?");
    await page.getByText("Select a field type").click();
    await page.getByLabel("textarea").getByText("textarea").click();
    await page.getByLabel("Required").check();
    await page.getByRole("button", { name: "Save new field" }).click();

    await expect(
      page.getByRole("heading", { name: "Add new field" })
    ).not.toBeVisible();
    await expect(
      page.getByText("What is your experience with hackathons?")
    ).toBeVisible();
    await expect(page.getByText("textarea")).toBeVisible();

    await page.getByRole("button", { name: "Create new field" }).click();
    await page
      .getByLabel("Label")
      .fill("I have been at the hackathon in the past.");
    await page.getByText("Select a field type").click();
    await page.getByLabel("checkbox").getByText("checkbox").click();
    await page.getByRole("button", { name: "Save new field" }).click();

    await expect(
      page.getByRole("heading", { name: "Add new field" })
    ).not.toBeVisible();
    await expect(
      page.getByText("I have been at the hackathon in the past.")
    ).toBeVisible();
    await expect(page.getByText("checkbox")).toBeVisible();

    await page.getByRole("button", { name: "Create new field" }).click();
    await page.getByLabel("Label").fill("What company do you work for?");
    await page.getByText("Select a field type").click();
    await page.getByLabel("text", { exact: true }).getByText("text").click();
    await page.getByRole("button", { name: "Save new field" }).click();

    await expect(
      page.getByRole("heading", { name: "Add new field" })
    ).not.toBeVisible();
    await expect(page.getByText("What company do you work for?")).toBeVisible();
    await expect(page.getByText("text", { exact: true })).toBeVisible();

    // Deleting field
    await page
      .getByRole("button", {
        name: "Open menu iHaveBeenAtTheHackathonInThePast form field",
      })
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await expect(
      page.getByText(
        'Are you sure you want to delete form field "I have been at the hackathon in the past."? It may contain already filled values!'
      )
    ).toBeVisible();
    await page.getByRole("button", { name: "No" }).click();
    await expect(page.getByRole("button", { name: "No" })).not.toBeVisible();
    await expect(
      page.getByText("I have been at the hackathon in the past.")
    ).toBeVisible();

    await page
      .getByRole("button", {
        name: "Open menu iHaveBeenAtTheHackathonInThePast form field",
      })
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await expect(
      page.getByText(
        'Are you sure you want to delete form field "I have been at the hackathon in the past."? It may contain already filled values!'
      )
    ).toBeVisible();
    await page.getByRole("button", { name: "Yes" }).click();
    await expect(page.getByRole("button", { name: "Yes" })).not.toBeVisible();
    await expect(
      page.getByText("I have been at the hackathon in the past.")
    ).not.toBeVisible();

    // Recreating deleted field
    await page.getByRole("button", { name: "Create new field" }).click();
    await page
      .getByLabel("Label")
      .fill("I have been at the hackathon in the past.");
    await page.getByText("Select a field type").click();
    await page.getByLabel("checkbox").getByText("checkbox").click();
    await page.getByRole("button", { name: "Save new field" }).click();

    await expect(
      page.getByRole("heading", { name: "Add new field" })
    ).not.toBeVisible();
    await expect(
      page.getByText("I have been at the hackathon in the past.")
    ).toBeVisible();
    await expect(page.getByText("checkbox")).toBeVisible();

    // Editing field
    await page
      .getByRole("button", {
        name: "Open menu whatIsYourExperienceWithHackathons form field",
      })
      .click();
    await page.getByRole("menuitem", { name: "Edit field" }).click();
    await expect(
      page.getByRole("heading", { name: "Edit field" })
    ).toBeVisible();
    await expect(page.getByLabel("Label")).toHaveValue(
      "What is your experience with hackathons?"
    );
    await page.getByLabel("Label").fill("What is your experience with coding?");
    await page.getByRole("button", { name: "Save field" }).click();

    await expect(
      page.getByRole("heading", { name: "Edit field" })
    ).not.toBeVisible();
    await expect(
      page.getByText("What is your experience with hackathons?")
    ).not.toBeVisible();
    await expect(
      page.getByText("What is your experience with coding?")
    ).toBeVisible();

    await page.getByRole("link", { name: "Back to steps" }).click();
    await expect(
      page.getByRole("heading", { name: "Application Form Editor" })
    ).toBeVisible();
    await expect(page.getByText("Experience")).toBeVisible();

    // Deleting step with fields
    await page.getByRole("button", { name: "Delete step 2" }).click();
    // await expect(
    //   page.getByText(
    //     "This step contains fields, which may have some already filled values. Deleting it will also delete all the fields and their values. Do you want to proceed?"
    //   )
    // ).toBeVisible();
    // await page.getByRole("button", { name: "No" }).click();
    await expect(page.getByText("Experience")).toBeVisible();
  });

  test("submitting application form (signed in hacker)", async ({
    page,
    applicationPage,
  }) => {
    await applicationPage.openSignedIn();
    await expect(page.getByText("Application status: open")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Submit application" })
    ).toBeDisabled();

    // General info section
    await page.getByText("General info").click();

    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByLabel("Full name")).toBeFocused();
    await page.getByLabel("Full name").fill("Test Testovic");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByTestId("Step 1 completed icon")).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Submit application" })
    ).toBeDisabled();

    // Experience section
    await page.getByText("Experience").click();
    await page.getByRole("link", { name: "Back" }).click();
    await expect(page.getByText("Application status: open")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Submit application" })
    ).toBeDisabled();
    await expect(page.getByTestId("Step 2 completed icon")).not.toBeVisible();
    await page.getByText("Experience").click();
    await expect(page.getByText("Experience - description")).toBeVisible();
    await page
      .getByLabel("What is your experience with coding?")
      .fill("It's good");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByTestId("Step 2 completed icon")).toBeVisible();

    await page.getByText("Experience").click();
    await expect(
      page.getByLabel("What is your experience with coding?")
    ).toHaveValue("It's good");

    await page.getByLabel("What company do you work for?").fill("Test company");
    await page.getByLabel("I have been at the hackathon in the past.").check();
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByTestId("Step 2 completed icon")).toBeVisible();
    await page.getByText("Experience").click();
    await expect(
      page.getByLabel("What is your experience with coding?")
    ).toHaveValue("It's good");
    await expect(page.getByLabel("What company do you work for?")).toHaveValue(
      "Test company"
    );
    await expect(
      page.getByLabel("I have been at the hackathon in the past.")
    ).toBeChecked();
    await page.getByRole("link", { name: "Back" }).click();

    await expect(
      page.getByRole("button", { name: "Submit application" })
    ).toBeEnabled();

    await page.getByRole("button", { name: "Submit application" }).click();

    await expect(
      page.getByText("Are you sure you want to submit your application?")
    ).toBeVisible();

    await page.getByRole("button", { name: "No" }).click();

    await expect(page.getByText("Application status: open")).toBeVisible();

    await page.getByRole("button", { name: "Submit application" }).click();
    await page.getByRole("button", { name: "Yes" }).click();

    await expect(page.getByText("Application status: submitted")).toBeVisible();
  });

  test("submitting application form (unsigned hacker)", async ({
    page,
    applicationPage,
  }) => {
    await applicationPage.openUnsigned();

    await expect(page.getByText("You are not signed in")).toBeVisible();
    await expect(page.getByText("Application status: open")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Submit application" })
    ).toBeDisabled();

    // General info section
    await page.getByText("General info").click();

    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByLabel("Full name")).toBeFocused();
    await page.getByLabel("Full name").fill("Samuel Testovic");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByTestId("Step 1 completed icon")).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Submit application" })
    ).toBeDisabled();

    // Experience section
    await page.getByText("Experience").click();
    await page.getByRole("link", { name: "Back" }).click();
    await expect(page.getByText("Application status: open")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Submit application" })
    ).toBeDisabled();
    await expect(page.getByTestId("Step 2 completed icon")).not.toBeVisible();
    await page.getByText("Experience").click();
    await page
      .getByLabel("What is your experience with coding?")
      .fill("I am awesome");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByTestId("Step 2 completed icon")).toBeVisible();

    await page.getByText("Experience").click();
    await expect(page.getByText("Experience - description")).toBeVisible();
    await expect(
      page.getByLabel("What is your experience with coding?")
    ).toHaveValue("I am awesome");

    await page
      .getByLabel("What company do you work for?")
      .fill("My own company");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByTestId("Step 2 completed icon")).toBeVisible();
    await page.getByText("Experience").click();
    await expect(
      page.getByLabel("What is your experience with coding?")
    ).toHaveValue("I am awesome");
    await expect(page.getByLabel("What company do you work for?")).toHaveValue(
      "My own company"
    );
    await expect(
      page.getByLabel("I have been at the hackathon in the past.")
    ).not.toBeChecked();
    await page.getByRole("link", { name: "Back" }).click();

    await expect(
      page.getByRole("button", { name: "Submit application" })
    ).toBeDisabled();

    await expect(page.getByText("You are not signed in")).toBeVisible();
    await expect(page.getByText("Application status: open")).toBeVisible();
  });

  test("see submitted applications", async ({ page, dashboardPage }) => {
    await expect(
      page.getByRole("heading", {
        name: "Dashboard",
      })
    ).toBeVisible();

    await expect(page.getByText("Test Testovic")).toBeVisible();
    await expect(page.getByText("submitted")).toBeVisible();

    await page.getByRole("link", { name: "Details" }).click();

    await expect(
      page.getByRole("heading", {
        name: "Application detail",
      })
    ).toBeVisible();

    await expect(page.getByText("Test Testovic")).toBeVisible();
    await expect(page.getByText("It's good")).toBeVisible();
    await expect(page.getByText("Test company")).toBeVisible();
  });
});
