/* eslint-disable react/jsx-key */
import type { Meta, StoryObj } from "@storybook/react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";
import { FormLabel } from "@/components/ui/form";

const meta: Meta<typeof RadioGroup> = {
  title: "UI Components/Form fields/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: {
    children: [
      <span>
        <RadioGroupItem value={"Item1"} />
        <FormLabel className="font-normal cursor-pointer">Item 1</FormLabel>
      </span>,
      <span>
        <RadioGroupItem value={"Item2"} />
        <FormLabel className="font-normal cursor-pointer">Item 2</FormLabel>
      </span>,
      <span>
        <RadioGroupItem value={"Item3"} />
        <FormLabel className="font-normal cursor-pointer">Item 3</FormLabel>
      </span>,
    ],
  },
};
