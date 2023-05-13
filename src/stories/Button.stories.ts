import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../components/Button";

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
    colorType: "primary",
    label: "Click me",
  },
};

export const Secondary: Story = {
  args: {
    label: "Click me",
    colorType: "secondary",
  },
};
