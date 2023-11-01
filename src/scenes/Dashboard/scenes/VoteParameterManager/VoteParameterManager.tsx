import React from "react";
import getVoteParameters from "@/server/getters/dashboard/voteParameterManager/voteParameters";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <div className="md:max-w-[50%]">
          <VoteParametersTable voteParameters={voteParameters} />
        </div>
      </CardContent>
      <CardFooter>
        <NewVoteParameterButton hackathonId={hackathonId} />
      </CardFooter>
    </Card>
  );
};

export default VoteParameterManager;
