import type { Meta, StoryObj } from "@storybook/react";

import { InputRadioGroup } from "../components/InputRadioGroup";

const meta: Meta<typeof InputRadioGroup> = {
  title: "UI Components/InputRadioGroup",
  component: InputRadioGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InputRadioGroup>;

export const Default: Story = {
  args: {
    label: "Are you a robot?",
    options: ["Yes", "No"],
    name: "robot",
    required: true,
    direction: "column",
  },
};
