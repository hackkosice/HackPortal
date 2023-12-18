"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import useLog, { LogAction } from "@/services/hooks/useLog";
import declineAttendance from "@/server/actions/applicationForm/declineAttendance";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

const DeclineAttendanceButton = () => {
  const { log } = useLog();
  const onDeclineAttendanceClick = async () => {
    log({
      action: LogAction.ButtonClicked,
      detail: "Decline attendance",
    });
    await declineAttendance();
  };
  return (
    <ConfirmationDialog
      question={"Are you sure you want to decline attendance?"}
      onAnswer={async (answer) => {
        if (answer) {
          await onDeclineAttendanceClick();
        }
      }}
    >
      <Button
        variant="outline"
        className="bg-primaryTitle hover:bg-primaryTitle"
      >
        Decline attendance
      </Button>
    </ConfirmationDialog>
  );
};

export default DeclineAttendanceButton;
