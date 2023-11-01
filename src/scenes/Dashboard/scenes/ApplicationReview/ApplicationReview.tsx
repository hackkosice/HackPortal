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

type ApplicationReviewProps = {
  hackathonId: number;
};
const ApplicationReview = async ({ hackathonId }: ApplicationReviewProps) => {
  const { applicationId } = await getApplicationIdForReview(hackathonId);
  const voteParameters = await getVoteParameters(hackathonId);
  return (
    <Stack direction="row" className="w-full flex-wrap md:flex-nowrap md:px-20">
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
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/${hackathonId}/applications`}>
              Back to applications
            </Link>
          </Button>
        </CardFooter>
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
  );
};

export default ApplicationReview;
