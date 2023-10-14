/* eslint-disable react/jsx-key */
import type { Meta, StoryObj } from "@storybook/react";

import { Stack } from "../ui/stack";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Stack> = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  args: {
    children: [
      <Button>Item 1</Button>,
      <Button>Item 2</Button>,
      <Button>Item 3</Button>,
    ],
    spacing: "medium",
    direction: "column",
  },
};
