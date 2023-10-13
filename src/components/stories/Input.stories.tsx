import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "@/components/ui/input";

const meta: Meta<typeof Input> = {
  title: "UI Components/Input",
  component: Input,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    required: true,
    placeholder: "John Doe",
    type: "text",
  },
};

export const Error: Story = {
  args: {
    required: true,
    placeholder: "John Doe",
    type: "text",
  },
};
