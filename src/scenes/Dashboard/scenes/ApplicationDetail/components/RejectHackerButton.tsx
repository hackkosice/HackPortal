"use client";

import React from "react";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import rejectHacker from "@/server/actions/dashboard/rejectHacker";

type InviteHackerButtonProps = {
  hackerId: number;
  hackerEmail: string;
  variant?: "button" | "text";
};
const RejectHackerButton = ({
  hackerId,
  hackerEmail,
  variant = "button",
}: InviteHackerButtonProps) => {
  return (
    <ConfirmationDialog
      onAnswer={async (value) => {
        if (value) {
          await rejectHacker({ hackerId });
        }
      }}
      question={`Are you sure you want to reject hacker "${hackerEmail}"?`}
    >
      {variant === "button" ? (
        <Button className="w-full md:w-fit" variant="outline">
          Reject hacker
        </Button>
      ) : (
        <Button variant="link" className="hover:no-underline text-red-600">
          Reject
        </Button>
      )}
    </ConfirmationDialog>
  );
};

export default RejectHackerButton;
