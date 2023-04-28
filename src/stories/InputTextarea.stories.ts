import type { Meta, StoryObj } from "@storybook/react";

import { InputTextarea } from "../components/InputTextarea";

const meta: Meta<typeof InputTextarea> = {
  title: "UI Components/InputTextarea",
  component: InputTextarea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InputTextarea>;

export const Default: Story = {
  args: {
    required: true,
    label: "Your experience",
  },
};
