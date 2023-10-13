import type { Meta, StoryObj } from "@storybook/react";

import { InputCheckbox } from "../InputCheckbox";

const meta: Meta<typeof InputCheckbox> = {
  title: "UI Components/InputCheckbox",
  component: InputCheckbox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InputCheckbox>;

export const Default: Story = {
  args: {
    required: true,
    label: "Are you okay with this?",
  },
};

export const Error: Story = {
  args: {
    required: true,
    label: "Are you okay with this?",
    error: "This field is required",
  },
};
