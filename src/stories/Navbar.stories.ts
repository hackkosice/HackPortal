import type { Meta, StoryObj } from "@storybook/react";

import Navbar from "../components/Navbar";

const meta: Meta<typeof Navbar> = {
  title: "Composite components/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {},
};