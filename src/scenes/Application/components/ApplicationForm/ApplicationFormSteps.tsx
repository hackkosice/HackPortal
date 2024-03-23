import React from "react";
import { Stack } from "@/components/ui/stack";
import ApplicationStepCard from "@/scenes/Application/components/ApplicationForm/components/ApplicationStepCard";
import getApplicationData from "@/server/getters/application/application";
import ApplicationStatusCard from "@/scenes/Application/components/ApplicationForm/components/ApplicationStatusCard";
import { Heading } from "@/components/ui/heading";
import LocalApplicationDataSync from "@/scenes/Application/components/ApplicationForm/components/LocalApplicationDataSync";
import LogMount from "@/components/common/LogMount";
import { LogAction } from "@/services/hooks/useLog";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import { Card } from "@/components/ui/card";

type ApplicationStepsProps = {
  closedPortal: boolean;
  hackathonId: number;
  applicationId: number | null;
};
const ApplicationFormSteps = async ({
  closedPortal,
  hackathonId,
  applicationId,
}: ApplicationStepsProps) => {
  const { data, authStatus } = await getApplicationData({
    hackathonId,
    applicationId,
  });
  return (
    <>
      <LogMount
        action={LogAction.PageDisplayed}
        detail="Application"
        data={{
          signedIn: authStatus?.signedIn,
          emailVerified: authStatus?.emailVerified,
          status: data?.application.status,
        }}
      />
      <LocalApplicationDataSync
        applicationId={applicationId}
        hackathonId={hackathonId}
      />
      <Stack className="w-full" direction="column">
        {data &&
          (closedPortal && data.application.status === "open" ? (
            <Card className="p-5 w-fit mx-auto container bg-primaryTitle">
              <Text className="text-white w-full text-center text-lg">
                Thank you for your interest, but the applications for this year
                are already closed. Please sign up for a hackathon next year.
              </Text>
            </Card>
          ) : (
            <>
              <Heading className="mx-auto md:mb-6">
                Your application for {data.hackathonName}:
              </Heading>
              <Stack direction="column" className="gap-5 md:gap-20 w-full">
                <ApplicationStatusCard status={data.application.status} />
                {data.application.status === "open" && (
                  <div className="mx-auto">
                    <Stack
                      justify="around"
                      spaceAfter="medium"
                      className="md:flex-row flex-col w-full md:gap-10"
                    >
                      {data.steps.map((step) => (
                        <ApplicationStepCard
                          key={step.id}
                          step={step}
                          isSignedIn={authStatus?.signedIn}
                        />
                      ))}
                      <ApplicationStepCard
                        key="submit"
                        step="submit"
                        canSubmit={data.canSubmit}
                        isSignedIn={authStatus?.signedIn}
                        hasEmailVerified={authStatus?.emailVerified}
                      />
                    </Stack>
                  </div>
                )}
                {data.application.status ===
                  ApplicationStatusEnum.confirmed && (
                  <Stack
                    className="mx-auto w-[90vw]"
                    alignItems="center"
                    direction="column"
                  >
                    <Text>
                      Use this button to show the check-in code to the organizer
                      when you arrive at the venue:
                    </Text>
                    <Button asChild>
                      <Link href="/check-in">Show checkin code</Link>
                    </Button>
                  </Stack>
                )}
              </Stack>
            </>
          ))}
      </Stack>
    </>
  );
};

export default ApplicationFormSteps;
