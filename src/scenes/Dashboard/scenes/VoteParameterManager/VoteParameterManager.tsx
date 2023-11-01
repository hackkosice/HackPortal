import React, { useState } from "react";
import getVoteParameters from "@/server/getters/dashboard/voteParameterManager/voteParameters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stack } from "@/components/ui/stack";
import NewVoteParameterButton from "@/scenes/Dashboard/scenes/VoteParameterManager/components/NewVoteParameterButton";
import VoteParametersTable from "@/scenes/Dashboard/scenes/VoteParameterManager/components/VoteParametersTable";

type VoteParameterManagerProps = {
  hackathonId: number;
};

const VoteParameterManager = async ({
  hackathonId,
}: VoteParameterManagerProps) => {
  const voteParameters = await getVoteParameters(hackathonId);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Vote parameters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Stack direction="column">
          <VoteParametersTable voteParameters={voteParameters} />
          <NewVoteParameterButton hackathonId={hackathonId} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default VoteParameterManager;
