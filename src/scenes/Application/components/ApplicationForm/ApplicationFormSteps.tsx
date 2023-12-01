import React from "react";
import { Stack } from "@/components/ui/stack";
import ApplicationStepCard from "@/scenes/Application/components/ApplicationForm/components/ApplicationStepCard";
import getApplicationData from "@/server/getters/application";
import ApplicationStatusCard from "@/scenes/Application/components/ApplicationForm/components/ApplicationStatusCard";
import { Heading } from "@/components/ui/heading";

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
    <Stack className="w-full" direction="column">
      <Heading className="mx-auto">
        Your application for Hack Kosice 2024:
      </Heading>

      {data && (
        <>
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
                    shouldUseLocalIsCompleted={!authStatus?.signedIn}
                  />
                ))}
                <ApplicationStepCard key="submit" step="submit" />
              </Stack>
            </div>
          )}
        </>
      )}
    </Stack>
  );
};

export default ApplicationFormSteps;
