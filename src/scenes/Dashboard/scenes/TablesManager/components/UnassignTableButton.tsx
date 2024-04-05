"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import unassignTableFromTeam from "@/server/actions/dashboard/tables/unassignTableFromTeam";
import callServerAction from "@/services/helpers/server/callServerAction";
import { Undo2 } from "lucide-react";

type UnassignTableButtonProps = {
  teamId: number;
};
const UnassignTableButton = ({ teamId }: UnassignTableButtonProps) => {
  const onUnassignTable = async () => {
    await callServerAction(unassignTableFromTeam, {
      teamId,
    });
  };
  return (
    <Button
      variant="ghost"
      size="small"
      className="text-gray-500 px-1"
      onClick={onUnassignTable}
    >
      <Undo2 className="h-4 w-4" />
    </Button>
  );
};

export default UnassignTableButton;
