/* eslint-disable react/jsx-key */
import type { Meta, StoryObj } from "@storybook/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const meta: Meta<typeof Select> = {
  title: "UI Components/Form fields/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    children: [
      <SelectTrigger>
        <SelectValue placeholder="Default value" />
      </SelectTrigger>,
      <SelectContent>
        <SelectItem key={1} value="1">
          Item 1
        </SelectItem>
        <SelectItem key={2} value="2">
          Item 2
        </SelectItem>
        <SelectItem key={3} value="3">
          Item 3
        </SelectItem>
      </SelectContent>,
    ],
  },
};
