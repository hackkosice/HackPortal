import React from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import getApplicationIdForReview from "@/server/getters/dashboard/applicationReview/getApplicationIdForReview";
import ApplicationDetail from "@/scenes/Dashboard/scenes/ApplicationDetail/components/ApplicationDetail";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Stack } from "@/components/ui/stack";
import getVoteParameters from "@/server/getters/dashboard/voteParameterManager/voteParameters";
import VotePicker from "@/scenes/Dashboard/scenes/ApplicationReview/components/VotePicker";
import { LogAction } from "@/services/hooks/useLog";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

type ApplicationReviewProps = {
  hackathonId: number;
};
const ApplicationReview = async ({ hackathonId }: ApplicationReviewProps) => {
  const { applicationId } = await getApplicationIdForReview(hackathonId);
  const voteParameters = await getVoteParameters(hackathonId);
  return (
    <Stack direction="column" className="md:px-20">
      <Link
        href={`/dashboard/${hackathonId}/applications`}
        className="text-hkOrange"
      >
        <Stack direction="row" alignItems="center" spacing="small">
          <ChevronLeftIcon className="h-5 w-5" />
          Back to applications
        </Stack>
      </Link>
      <Stack direction="row" className="w-full flex-wrap md:flex-nowrap mb-20">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Application detail</CardTitle>
          </CardHeader>
          <CardContent>
            {applicationId === null ? (
              <Text>No application left to review. Good job!</Text>
            ) : (
              <ApplicationDetail applicationId={applicationId} />
            )}
          </CardContent>
        </Card>
        <Card className="w-[600px]">
          <CardHeader>
            <CardTitle>Voting</CardTitle>
          </CardHeader>
          <CardContent>
            {applicationId && (
              <VotePicker
                voteParameters={voteParameters}
                applicationId={applicationId}
              />
            )}
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
};

export default ApplicationReview;
