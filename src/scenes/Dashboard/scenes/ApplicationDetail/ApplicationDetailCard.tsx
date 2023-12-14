import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicationDetail from "@/scenes/Dashboard/scenes/ApplicationDetail/components/ApplicationDetail";
import { Stack } from "@/components/ui/stack";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import getApplicationMetadata from "@/server/getters/dashboard/applicationMetadata";
import InviteHackerButton from "@/scenes/Dashboard/scenes/ApplicationDetail/components/InviteHackerButton";
import RejectHackerButton from "@/scenes/Dashboard/scenes/ApplicationDetail/components/RejectHackerButton";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";

export type Props = {
  applicationId: number;
  hackathonId: number;
};

const ApplicationDetailCard = async ({ applicationId, hackathonId }: Props) => {
  const {
    score: applicationScore,
    status,
    hackerId,
    hackerEmail,
  } = await getApplicationMetadata(applicationId);
  return (
    <Stack direction="column" className="md:w-[70vw] mx-auto mb-20">
      <Link
        href={`/dashboard/${hackathonId}/applications`}
        className="text-hkOrange"
      >
        <Stack direction="row" alignItems="center" spacing="small">
          <ChevronLeftIcon className="h-5 w-5" />
          Back to applications
        </Stack>
      </Link>
      <Card className="md:w-[70vw] px-5 py-3">
        <CardHeader>
          <CardTitle>Application detail</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack className="md:gap-10 flex-wrap flex-col-reverse md:flex-row items-center md:items-start">
            <div className="md:w-[30vw]">
              <Text className="mb-2">
                <b>Email:</b> {hackerEmail}
              </Text>
              <ApplicationDetail applicationId={applicationId} />
            </div>
            <Stack
              direction="column"
              className="items-center md:items-start gap-2 md:gap-4"
            >
              <Heading size="small">Application status: {status}</Heading>
              {status !== ApplicationStatusEnum.open && (
                <>
                  <Heading size="small">Application score:</Heading>
                  <div
                    className={`w-[80px] h-[80px] rounded-[40px] border-4 flex justify-center items-center`}
                    style={{
                      borderColor: applicationScore.relevance.color,
                    }}
                  >
                    <Text
                      className={`text-[1.7rem] font-bold`}
                      style={{
                        color: applicationScore.relevance.color,
                      }}
                    >
                      {applicationScore.score}
                    </Text>
                  </div>
                  <Text
                    style={{
                      color: applicationScore.relevance.color,
                    }}
                  >
                    <b>{applicationScore.relevance.value} relevance</b> (
                    {applicationScore.numberOfVotes}{" "}
                    {applicationScore.numberOfVotes === 1 ? "vote" : "votes"})
                  </Text>
                </>
              )}

              {status === ApplicationStatusEnum.submitted && (
                <>
                  <Heading size="small">Actions</Heading>
                  <InviteHackerButton
                    hackerId={hackerId}
                    hackerEmail={hackerEmail}
                  />
                  <RejectHackerButton
                    hackerId={hackerId}
                    hackerEmail={hackerEmail}
                  />
                </>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ApplicationDetailCard;
