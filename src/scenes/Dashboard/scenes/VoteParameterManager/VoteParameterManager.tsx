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
import { Stack } from "@/components/ui/stack";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

type VoteParameterManagerProps = {
  hackathonId: number;
};

const VoteParameterManager = async ({
  hackathonId,
}: VoteParameterManagerProps) => {
  const voteParameters = await getVoteParameters(hackathonId);
  return (
    <div className="md:w-[60vw] mx-auto">
      <Link
        href={`/dashboard/${hackathonId}/settings`}
        className="text-hkOrange"
      >
        <Stack direction="row" alignItems="center" spacing="small">
          <ChevronLeftIcon className="h-5 w-5" />
          Back to settings
        </Stack>
      </Link>
      <Card className="md:w-[60vw] mx-auto mt-5">
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
    </div>
  );
};

export default VoteParameterManager;
