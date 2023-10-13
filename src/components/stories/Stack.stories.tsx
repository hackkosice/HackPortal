import type { Meta, StoryObj } from "@storybook/react";

import { Stack } from "../Stack";
import { InputText } from "../ui/InputText";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Stack> = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Stack>;

const StackChildren = [
  // eslint-disable-next-line react/jsx-key
  <InputText label="Username" />,
  // eslint-disable-next-line react/jsx-key
  <InputText label="Password" type="password" />,
  // eslint-disable-next-line react/jsx-key
  <Button>Sign in</Button>,
];

export const Default: Story = {
  args: {
    children: StackChildren,
    spacing: "medium",
    direction: "column",
  },
};
