import type { Meta, StoryObj } from "@storybook/react";

import { Stack } from "../components/Stack";
import { InputText } from "../components/InputText";
import { Button } from "../components/Button";

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
  <Button label={"Sign in"} />,
];

export const Default: Story = {
  args: {
    children: StackChildren,
    spacing: "medium",
    direction: "column",
  },
};
