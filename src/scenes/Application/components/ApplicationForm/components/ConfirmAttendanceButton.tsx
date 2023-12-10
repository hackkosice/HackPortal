"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import confirmAttendance from "@/server/actions/applicationForm/confirmAttendance";
import useLog, { LogAction } from "@/services/hooks/useLog";

const ConfirmAttendanceButton = () => {
  const { log } = useLog();
  const onConfirmAttendanceClick = async () => {
    log({
      action: LogAction.ButtonClicked,
      detail: "Confirm attendance",
    });
    await confirmAttendance();
  };
  return <Button onClick={onConfirmAttendanceClick}>Confirm attendance</Button>;
};

export default ConfirmAttendanceButton;
