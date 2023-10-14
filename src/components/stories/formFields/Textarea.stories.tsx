import type { Meta, StoryObj } from "@storybook/react";

import { Textarea } from "@/components/ui/textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI Components/Form fields/Textarea",
  component: Textarea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Lorem ipsum",
  },
};
