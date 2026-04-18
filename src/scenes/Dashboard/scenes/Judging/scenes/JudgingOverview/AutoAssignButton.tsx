"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import autoAssignJudging from "@/server/actions/dashboard/judging/autoAssignJudging";
import callServerAction from "@/services/helpers/server/callServerAction";

type AutoAssignButtonProps = {
  hackathonId: number;
};

const AutoAssignButton = ({ hackathonId }: AutoAssignButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAutoAssign = async () => {
    setLoading(true);
    setError(null);
    const res = await callServerAction(autoAssignJudging, hackathonId);
    setLoading(false);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div>
      <Button onClick={handleAutoAssign} disabled={loading}>
        {loading ? "Assigning..." : "Auto-assign teams"}
      </Button>
      {error && (
        <Text size="small" className="text-red-500 mt-1">
          {error}
        </Text>
      )}
    </div>
  );
};

export default AutoAssignButton;
