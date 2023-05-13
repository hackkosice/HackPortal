import type { Meta, StoryObj } from "@storybook/react";

import { InputSelect } from "../components/InputSelect";

const meta: Meta<typeof InputSelect> = {
  title: "UI Components/InputSelect",
  component: InputSelect,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InputSelect>;

export const Default: Story = {
  args: {
    label: "Your school",
    options: ["University", "High school"],
    required: true,
  },
};

export const Error: Story = {
  args: {
    label: "Your school",
    options: ["University", "High school"],
    required: true,
    error: "Wrong choice",
  },
};
