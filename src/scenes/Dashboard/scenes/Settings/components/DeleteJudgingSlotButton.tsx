"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import callServerAction from "@/services/helpers/server/callServerAction";
import deleteJudgingSlot from "@/server/actions/dashboard/judging/deleteJudgingSlot";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

type DeleteJudgingSlotButtonProps = {
  judgingSlotId: number;
  startTime: string;
  endTime: string;
};
const DeleteJudgingSlotButton = ({
  judgingSlotId,
  startTime,
  endTime,
}: DeleteJudgingSlotButtonProps) => {
  const onClick = async () => {
    await callServerAction(deleteJudgingSlot, { judgingSlotId });
  };
  return (
    <ConfirmationDialog
      question={`Are you sure you want to delete judging slot "${startTime} - ${endTime}"?`}
      onAnswer={async (answer) => {
        if (answer) {
          await onClick();
        }
      }}
    >
      <Button variant="ghost" className="p-1 text-red-500">
        <Trash className="h-4 w-4" />
      </Button>
    </ConfirmationDialog>
  );
};

export default DeleteJudgingSlotButton;
