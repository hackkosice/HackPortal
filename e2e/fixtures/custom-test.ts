import { test as base } from "@playwright/test";
import { DashboardPage } from "./DashboardPage";
import { ApplicationPage } from "./ApplicationPage";

type CustomFixtures = {
  dashboardPage: DashboardPage;
  applicationPage: ApplicationPage;
};

export const test = base.extend<CustomFixtures>({
  dashboardPage: async ({ page, isMobile }, use) => {
    const dashboardPage = new DashboardPage(page, isMobile);

    await dashboardPage.goto();

    await use(dashboardPage);
  },
  applicationPage: async ({ page, isMobile }, use) => {
    const applicationPage = new ApplicationPage(page, isMobile);

    await applicationPage.goto();

    await use(applicationPage);
  },
});

export { expect } from "@playwright/test";
