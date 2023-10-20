import { test as base } from "@playwright/test";
import { DashboardPage } from "./DashboardPage";
import { ApplicationPage } from "./ApplicationPage";

type CustomFixtures = {
  dashboardPage: DashboardPage;
  applicationPage: ApplicationPage;
};

export const test = base.extend<CustomFixtures>({
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.goto();

    await use(dashboardPage);

    // await dashboardPage.signOut();
  },
  applicationPage: async ({ page }, use) => {
    const applicationPage = new ApplicationPage(page);

    await applicationPage.goto();

    await use(applicationPage);
  },
});

export { expect } from "@playwright/test";
