"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import callServerAction from "@/services/helpers/server/callServerAction";
import deleteSponsorJudging from "@/server/actions/dashboard/judging/deleteSponsorJudging";

type DeleteSponsorJudgingButtonProps = {
  sponsorJudgingId: number;
};

const DeleteSponsorJudgingButton = ({
  sponsorJudgingId,
}: DeleteSponsorJudgingButtonProps) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <ConfirmationDialog
        question="Remove this judging assignment?"
        onAnswer={async (answer) => {
          if (!answer) return;
          const res = await callServerAction(deleteSponsorJudging, {
            sponsorJudgingId,
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

export default DeleteSponsorJudgingButton;
