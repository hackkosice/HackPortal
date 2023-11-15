import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class DashboardPage {
  constructor(public readonly page: Page) {}

  async goto() {
    await this.page.goto("/");

    await this.page.getByRole("link", { name: "Sign in" }).click();

    await this.page.fill('input[name="email"]', "test-org@hackkosice.com");
    await this.page.fill('input[name="password"]', "test123");

    await this.page.getByRole("button", { name: /^Sign in$/ }).click();

    await this.page.waitForTimeout(2000);
  }

  async openFormEditor() {
    await this.page.getByRole("tab", { name: "Application form" }).click();

    await expect(
      this.page.getByRole("heading", { name: "Application Form Editor" })
    ).toBeVisible();

    await this.page.waitForTimeout(2000);
  }

  async createNewFormField({
    label,
    description,
    type,
    required,
    shownInList = true,
  }: {
    label: string;
    description?: string;
    type: "text" | "textarea" | "select" | "checkbox" | "radio";
    required: boolean;
    shownInList?: boolean;
  }) {
    await this.page.getByRole("button", { name: "Create new field" }).click();

    await expect(
      this.page.getByRole("heading", { name: "Add new field" })
    ).toBeVisible();

    await this.page.getByLabel("Label").fill(label);
    if (description) {
      await this.page.getByLabel("Description").fill(label);
    }
    await this.page.getByText("Select a field type").click();
    await this.page.getByLabel(type, { exact: true }).getByText(type).click();
    if (required) {
      await this.page.getByLabel("Required").check();
    }
    if (shownInList) {
      await this.page
        .getByLabel("Should be shown in application list and detail")
        .check();
    }
    await this.page.getByRole("button", { name: "Save new field" }).click();
    await expect(
      this.page.getByRole("heading", { name: "Add new field" })
    ).not.toBeVisible();
  }

  async editFormFieldLabel({
    name,
    oldLabel,
    newLabel,
  }: {
    name: string;
    oldLabel: string;
    newLabel: string;
  }) {
    await this.page
      .getByRole("button", {
        name: `Open menu ${name} form field`,
      })
      .click();
    await this.page.getByRole("menuitem", { name: "Edit field" }).click();
    await expect(
      this.page.getByRole("heading", { name: "Edit field" })
    ).toBeVisible();
    await expect(this.page.getByLabel("Label")).toHaveValue(oldLabel);
    await this.page.getByLabel("Label").fill(newLabel);
    await this.page.getByRole("button", { name: "Save field" }).click();

    await expect(
      this.page.getByRole("heading", { name: "Edit field" })
    ).not.toBeVisible();
  }

  async deleteFormField({
    name,
    acceptModal = true,
  }: {
    name: string;
    acceptModal?: boolean;
  }) {
    await this.page
      .getByRole("button", {
        name: `Open menu ${name} form field`,
      })
      .click();
    await this.page.getByRole("menuitem", { name: "Delete" }).click();
    await expect(
      this.page.getByText(
        'Are you sure you want to delete form field "I have been at the hackathon in the past."? It may contain already filled values!'
      )
    ).toBeVisible();
    if (acceptModal) {
      await this.page.getByRole("button", { name: "Yes" }).click();
      await expect(
        this.page.getByRole("button", { name: "Yes" })
      ).not.toBeVisible();
    } else {
      await this.page.getByRole("button", { name: "No" }).click();
      await expect(
        this.page.getByRole("button", { name: "No" })
      ).not.toBeVisible();
    }
  }

  async openOptionLists() {
    await this.page.getByRole("tab", { name: "Settings" }).click();

    await this.page.getByRole("link", { name: "Manage option lists" }).click();

    await expect(
      this.page.getByRole("heading", { name: "Option Lists Manager" })
    ).toBeVisible();
  }

  async openVoteParameters() {
    await this.page.getByRole("tab", { name: "Settings" }).click();

    await this.page
      .getByRole("link", { name: "Manage vote parameters" })
      .click();

    await expect(
      this.page.getByRole("heading", { name: "Vote parameters" })
    ).toBeVisible();
  }

  async createNewVoteParameter({
    name,
    description,
    minValue,
    maxValue,
    weight,
  }: {
    name: string;
    description: string;
    minValue: number;
    maxValue: number;
    weight: number;
  }) {
    await this.page
      .getByRole("button", { name: "Add new vote parameter" })
      .click();
    await expect(
      this.page.getByRole("heading", { name: "Create new vote parameter" })
    ).toBeVisible();
    await this.page.getByLabel("Name").fill(name);
    await this.page.getByLabel("Optional description").fill(description);
    await this.page.getByLabel("Minimal value").fill(minValue.toString());
    await this.page.getByLabel("Maximal value").fill(maxValue.toString());
    await this.page.getByLabel("Weight").fill(weight.toString());
    await this.page.getByRole("button", { name: "Create" }).click();
    await expect(
      this.page.getByRole("heading", { name: "Create new vote parameter" })
    ).not.toBeVisible();
  }

  async editVoteParameter({
    originalName,
    name,
    description,
    minValue,
    maxValue,
    weight,
  }: {
    originalName: string;
    name: string;
    description: string;
    minValue: number;
    maxValue: number;
    weight: number;
  }) {
    await this.page
      .getByRole("button", { name: `Open menu ${originalName} vote parameter` })
      .click();
    await this.page
      .getByRole("menuitem", { name: "Edit vote parameter" })
      .click();
    await expect(
      this.page.getByRole("heading", { name: "Edit vote parameter" })
    ).toBeVisible();
    await this.page.getByLabel("Name").fill(name);
    await this.page.getByLabel("Optional description").fill(description);
    await this.page.getByLabel("Minimal value").fill(minValue.toString());
    await this.page.getByLabel("Maximal value").fill(maxValue.toString());
    await this.page.getByLabel("Weight").fill(weight.toString());
    await this.page.getByRole("button", { name: "Save" }).click();
    await expect(
      this.page.getByRole("heading", { name: "Edit vote parameter" })
    ).not.toBeVisible();
  }

  async deleteVoteParameter({ name }: { name: string }) {
    await this.page
      .getByRole("button", { name: `Open menu ${name} vote parameter` })
      .click();
    await this.page.getByRole("menuitem", { name: "Delete" }).click();
    await expect(
      this.page.getByText(
        `Are you sure you want to delete vote parameter "${name}"? It may contain some votes already!`
      )
    ).toBeVisible();
    await this.page.getByRole("button", { name: "No" }).click();
    await expect(
      this.page.getByRole("button", { name: "No" })
    ).not.toBeVisible();
    await expect(this.page.getByText(name, { exact: true })).toBeVisible();

    await this.page
      .getByRole("button", { name: `Open menu ${name} vote parameter` })
      .click();
    await this.page.getByRole("menuitem", { name: "Delete" }).click();
    await expect(
      this.page.getByText(
        `Are you sure you want to delete vote parameter "${name}"? It may contain some votes already!`
      )
    ).toBeVisible();
    await this.page.getByRole("button", { name: "Yes" }).click();
    await expect(
      this.page.getByRole("button", { name: "Yes" })
    ).not.toBeVisible();
    await expect(this.page.getByText(name, { exact: true })).not.toBeVisible();
  }

  async signOut() {
    await this.page.getByRole("button", { name: "Sign out" }).click();

    await expect(
      this.page.getByRole("heading", { name: "Sign in" })
    ).toBeVisible();
  }
}
