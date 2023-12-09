import React from "react";
import { Stack } from "@/components/ui/stack";
import ApplicationStepCard from "@/scenes/Application/components/ApplicationForm/components/ApplicationStepCard";
import getApplicationData from "@/server/getters/application/application";
import ApplicationStatusCard from "@/scenes/Application/components/ApplicationForm/components/ApplicationStatusCard";
import { Heading } from "@/components/ui/heading";
import LocalApplicationDataSync from "@/scenes/Application/components/ApplicationForm/components/LocalApplicationDataSync";

type ApplicationStepsProps = {
  hackathonId: number;
  applicationId: number | null;
};
const ApplicationFormSteps = async ({
  hackathonId,
  applicationId,
}: ApplicationStepsProps) => {
  const { data, authStatus } = await getApplicationData({
    hackathonId,
    applicationId,
  });
  return (
    <>
      <LocalApplicationDataSync
        applicationId={applicationId}
        hackathonId={hackathonId}
      />
      <Stack className="w-full" direction="column">
        <Heading className="mx-auto md:mb-6">
          Your application for Hack Kosice 2024:
        </Heading>

        {data && (
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
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default ApplicationFormSteps;
