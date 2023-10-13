import type { Meta, StoryObj } from "@storybook/react";

import { Modal } from "../Modal";
import { InputText } from "../ui/InputText";
import { Button } from "../Button";
import { Stack } from "../Stack";

const meta: Meta<typeof Modal> = {
  title: "Layout/Modal",
  component: Modal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Modal>;

const ModalChildren = [
  // eslint-disable-next-line react/jsx-key
  <Stack direction="column">
    <InputText label="New title" />
    <Button label={"Save"} />
  </Stack>,
];
export const Default: Story = {
  args: {
    children: ModalChildren,
    isOpened: true,
  },
};
