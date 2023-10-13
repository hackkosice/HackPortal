import type { Meta, StoryObj } from "@storybook/react";

import { Heading } from "../Heading";

const meta: Meta<typeof Heading> = {
  title: "UI Components/Heading",
  component: Heading,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
  args: {
    children: "Lorem ipsum",
    size: "medium",
  },
};
