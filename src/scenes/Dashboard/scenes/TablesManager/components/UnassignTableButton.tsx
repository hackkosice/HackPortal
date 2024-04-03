"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import unassignTableFromTeam from "@/server/actions/dashboard/tables/unassignTableFromTeam";
import callServerAction from "@/services/helpers/server/callServerAction";

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
      className="pl-1 text-gray-500"
      onClick={onUnassignTable}
    >
      Unassign
    </Button>
  );
};

export default UnassignTableButton;
