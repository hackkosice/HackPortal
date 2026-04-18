"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import callServerAction from "@/services/helpers/server/callServerAction";
import deleteTeamJudging from "@/server/actions/dashboard/judging/deleteTeamJudging";

type DeleteTeamJudgingButtonProps = {
  teamJudgingId: number;
};

const DeleteTeamJudgingButton = ({
  teamJudgingId,
}: DeleteTeamJudgingButtonProps) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <ConfirmationDialog
        question="Remove this judging assignment?"
        onAnswer={async (answer) => {
          if (!answer) return;
          const res = await callServerAction(deleteTeamJudging, {
            teamJudgingId,
          });
          if (!res.success) setError(res.message);
        }}
      >
        <Button
          variant="ghost"
          size="small"
          className="text-red-500 hover:text-red-700 p-0 h-auto"
        >
          <X className="h-3 w-3" />
        </Button>
      </ConfirmationDialog>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </>
  );
};

export default DeleteTeamJudgingButton;
