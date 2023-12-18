import { test, expect } from "./fixtures/custom-test";
import { PrismaClient } from "@prisma/client";
import prepareDBBeforeTest from "./helpers/prepareDBBeforeTest";

test.describe("Travel reimbursements", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    const prisma = new PrismaClient();

    await prepareDBBeforeTest(prisma);

    await prisma.$disconnect();
  });

  test("unsigned user cannot request reimbursement", async ({
    applicationPage,
    page,
  }) => {
    await applicationPage.openUnsigned();

    await expect(
      page.getByRole("heading", { name: "Your travel reimbursement" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Request travel reimbursement" })
    ).toBeDisabled();
  });

  test("signed in hacker can request reimbursement", async ({
    applicationPage,
    page,
  }) => {
    await applicationPage.openSignedIn();

    await expect(
      page.getByRole("heading", { name: "Your travel reimbursement" })
    ).toBeVisible();

    await page
      .getByRole("button", { name: "Request travel reimbursement" })
      .click();

    await expect(
      page.getByRole("heading", { name: "Travel reimbursement request" })
    ).toBeVisible();
    await expect(
      page.getByText("Hack Kosice TEST reimbursement info")
    ).toBeVisible();
    await page
      .getByLabel("Country where you will be travelling from")
      .fill("USA");
    await page.getByRole("button", { name: "Request" }).click();

    await expect(
      page.getByText(
        "We have your reimbursement request. Please wait until we approve it."
      )
    ).toBeVisible();
  });

  test("organizer can approve reimbursement", async ({
    dashboardPage,
    page,
  }) => {
    await dashboardPage.openTravelReimbursementRequests();

    await expect(page.getByRole("cell", { name: "requested" })).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "test-hacker@test.com" })
    ).toBeVisible();
    await expect(page.getByRole("cell", { name: "USA" })).toBeVisible();

    await expect(page.getByRole("button", { name: "Reject" })).toBeVisible();
    await page.getByRole("button", { name: "Approve" }).click({ force: true });

    await expect(
      page.getByRole("heading", { name: "Set reimbursement amount" })
    ).toBeVisible();
    await expect(page.getByText("The country is: USA")).toBeVisible();
    await page.getByLabel("Amount to reimburse").fill("50");
    await page.getByRole("button", { name: "Save" }).click({ force: true });

    await expect(
      page.getByRole("cell", { name: "approvedWaitingForDocument" })
    ).toBeVisible();
    await expect(page.getByRole("cell", { name: "50,00 €" })).toBeVisible();
  });

  test("hacker can upload reimbursement document", async ({
    applicationPage,
    page,
  }) => {
    await applicationPage.openSignedIn();

    await expect(
      page.getByRole("heading", { name: "Your travel reimbursement" })
    ).toBeVisible();

    await expect(
      page.getByText(
        "Your reimbursement request has been approved with amount 50,00 €. Please upload your travel documents and financial details (such as IBAN), where the reimbursement will be paid out."
      )
    ).toBeVisible();

    await page.getByRole("button", { name: "Upload details" }).click();

    await expect(
      page.getByRole("heading", { name: "Upload details" })
    ).toBeVisible();

    await page
      .getByLabel("Financial details (bank account number, IBAN, etc.)")
      .fill("SK1234567890");

    await expect(page.getByLabel("Travel document")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Upload and save" })
    ).toBeVisible();
  });
});
