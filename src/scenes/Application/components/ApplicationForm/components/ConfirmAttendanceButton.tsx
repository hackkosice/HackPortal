"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import confirmAttendance from "@/server/actions/applicationForm/confirmAttendance";
import useLog, { LogAction } from "@/services/hooks/useLog";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

const ConfirmAttendanceButton = () => {
  const { log } = useLog();
  const onConfirmAttendanceClick = async () => {
    log({
      action: LogAction.ButtonClicked,
      detail: "Confirm attendance",
    });
    await confirmAttendance();
  };
  return (
    <ConfirmationDialog
      question={"Are you sure you want to confirm attendance?"}
      onAnswer={async (answer) => {
        if (answer) {
          await onConfirmAttendanceClick();
        }
      }}
    >
      <Button>Confirm attendance</Button>
    </ConfirmationDialog>
  );
};

export default ConfirmAttendanceButton;
