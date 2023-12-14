"use client";

import React from "react";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import inviteHacker from "@/server/actions/dashboard/inviteHacker";

type InviteHackerButtonProps = {
  hackerId: number;
  hackerEmail: string;
  variant?: "button" | "text";
};
const InviteHackerButton = ({
  hackerId,
  hackerEmail,
  variant = "button",
}: InviteHackerButtonProps) => {
  return (
    <ConfirmationDialog
      onAnswer={async (value) => {
        if (value) {
          await inviteHacker({ hackerId });
        }
      }}
      question={`Are you sure you want to invite hacker "${hackerEmail}"?`}
    >
      {variant === "button" ? (
        <Button className="w-full md:w-fit">Invite hacker</Button>
      ) : (
        <Button variant="link" className="hover:no-underline text-green-600">
          Invite
        </Button>
      )}
    </ConfirmationDialog>
  );
};

export default InviteHackerButton;
