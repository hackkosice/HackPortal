/* eslint-disable react/jsx-key */
import type { Meta, StoryObj } from "@storybook/react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/Text";
import React from "react";

const meta: Meta<typeof Card> = {
  title: "Layout/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: [
      <CardHeader>
        <CardTitle>This is the Header</CardTitle>
      </CardHeader>,
      <CardContent>
        <Text>This is content.</Text>
      </CardContent>,
      <CardFooter>
        <Button>Button in footer</Button>
      </CardFooter>,
    ],
  },
};
