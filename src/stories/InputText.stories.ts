import type { Meta, StoryObj } from "@storybook/react";

import { InputText } from "../components/InputText";

const meta: Meta<typeof InputText> = {
  title: "UI Components/InputText",
  component: InputText,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InputText>;

export const Default: Story = {
  args: {
    required: true,
    label: "Your name",
    placeholder: "John Doe",
    type: "text",
  },
};
