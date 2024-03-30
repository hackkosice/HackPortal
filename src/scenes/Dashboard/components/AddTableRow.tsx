"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import useLog, { LogAction } from "@/services/hooks/useLog";
import addNewTableRow from "@/server/actions/dashboard/hackerTableManager/addNewTableRow";

interface AddNewTableRowButtonProps {
  hackathonId: number;
}

const AddNewTableRowButton: React.FC<AddNewTableRowButtonProps> = ({
  hackathonId,
}) => {
  const { log } = useLog();

  const onAddNewTableRowClick = async () => {
    log({
      action: LogAction.ButtonClicked,
      detail: "Add Table Row",
    });
    try {
      await addNewTableRow(Number(hackathonId));
    } catch (error) {
      console.error("Failed to add new table row:", error);
    }
  };

  return (
    <Button size="small" onClick={onAddNewTableRowClick}>
      Add new Row
    </Button>
  );
};

export default AddNewTableRowButton;
