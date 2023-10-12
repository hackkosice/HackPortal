import type { Meta, StoryObj } from "@storybook/react";

import { Card } from "../components/Card";
import { Stack } from "../components/Stack";
import { InputText } from "../components/ui/InputText";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";

const meta: Meta<typeof Card> = {
  title: "Layout/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

const CardChildren = [
  // eslint-disable-next-line react/jsx-key
  <Stack direction="column">
    <Heading>Sign in</Heading>
    <InputText label="Username" />
    <InputText label="Password" type="password" />
    <Button label={"Sign in"} />
  </Stack>,
];

export const Default: Story = {
  args: {
    children: CardChildren,
  },
};
