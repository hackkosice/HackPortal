import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "../Text";

const meta: Meta<typeof Text> = {
  title: "UI Components/Text",
  component: Text,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    children: "Lorem ipsum",
    size: "medium",
  },
};
