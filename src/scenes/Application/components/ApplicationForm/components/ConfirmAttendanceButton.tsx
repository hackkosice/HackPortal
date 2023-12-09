"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import confirmAttendance from "@/server/actions/applicationForm/confirmAttendance";

const ConfirmAttendanceButton = () => {
  const onConfirmAttendanceClick = async () => {
    await confirmAttendance();
  };
  return <Button onClick={onConfirmAttendanceClick}>Confirm attendance</Button>;
};

export default ConfirmAttendanceButton;
