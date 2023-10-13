/* eslint-disable react/jsx-key */
import type { Meta, StoryObj } from "@storybook/react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Dialog> = {
  title: "Layout/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {
    children: [
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>,
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog title</DialogTitle>
        </DialogHeader>
        Dialog content
        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>,
    ],
  },
};
