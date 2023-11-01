import { test, expect } from "./fixtures/custom-test";
import { PrismaClient } from "@prisma/client";
import prepareDBBeforeTest from "./helpers/prepareDBBeforeTest";

test.describe("Vote parameters", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    const prisma = new PrismaClient();

    await prepareDBBeforeTest(prisma);

    await prisma.$disconnect();
  });

  test("organizer can create, edit and delete vote parameters", async ({
    dashboardPage,
    page,
  }) => {
    await dashboardPage.openVoteParameters();

    await expect(page.getByText("No results")).toBeVisible();

    // Creating vote parameter
    await dashboardPage.createNewVoteParameter({
      name: "Test parameter",
      description: "Test description",
      minValue: 1,
      maxValue: 10,
      weight: 1,
    });

    await expect(page.getByText("No results")).not.toBeVisible();
    await expect(page.getByText("Test parameter")).toBeVisible();

    // Editing vote parameter
    await dashboardPage.editVoteParameter({
      originalName: "Test parameter",
      name: "New parameter",
      description: "Test description edited",
      minValue: 1,
      maxValue: 10,
      weight: 1,
    });

    await expect(page.getByText("Test parameter")).not.toBeVisible();
    await expect(page.getByText("New parameter")).toBeVisible();

    // Deleting vote parameter
    await dashboardPage.deleteVoteParameter({
      name: "New parameter",
    });

    await expect(page.getByText("New parameter")).not.toBeVisible();
    await expect(page.getByText("No results")).toBeVisible();
  });
});
