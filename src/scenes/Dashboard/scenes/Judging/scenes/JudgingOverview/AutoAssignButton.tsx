"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import autoAssignJudging from "@/server/actions/dashboard/judging/autoAssignJudging";
import callServerAction from "@/services/helpers/server/callServerAction";

type AutoAssignButtonProps = {
  hackathonId: number;
};

const AutoAssignButton = ({ hackathonId }: AutoAssignButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleAutoAssign = async () => {
    setLoading(true);
    await callServerAction(autoAssignJudging, hackathonId);
    setLoading(false);
  };

  return (
    <Button onClick={handleAutoAssign} disabled={loading}>
      {loading ? "Assigning..." : "Auto-assign teams"}
    </Button>
  );
};

export default AutoAssignButton;
