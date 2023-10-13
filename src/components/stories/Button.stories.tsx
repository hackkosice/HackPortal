import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
  title: "UI Components/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    variant: "default",
    children: "Click me",
  },
};
export const Icon: Story = {
  args: {
    children: <TrashIcon className="h-4 w-4 text-hkOrange" />,
    variant: "ghost",
    size: "icon",
  },
};

export const Disabled: Story = {
  args: {
    children: "Click me",
    disabled: true,
  },
};
