import React from "react";
import { Text } from "@/components/ui/text";
import { Stack } from "@/components/ui/stack";
import ApplicationStep from "@/scenes/Application/components/ApplicationSteps/components/ApplicationStep";
import getApplicationData from "@/server/getters/application";
import ApplicationSubmitButton from "@/scenes/Application/components/ApplicationSteps/components/ApplicationSubmitButton";

const ApplicationSteps = async () => {
  const { data, signedIn } = await getApplicationData();
  return (
    <>
      {!signedIn && (
        <Text type="error" weight="bold">
          You are not signed in.
        </Text>
      )}
      <Text>Application status: {data.application.status}</Text>
      {data.application.status === "open" && (
        <Stack spacing="medium" direction="column">
          <Text>Complete steps below to finish your application:</Text>
          <Stack direction="column" spaceAfter="medium" spacing="small">
            {data.steps.map((step) => (
              <ApplicationStep
                key={step.id}
                step={step}
                shouldUseLocalIsCompleted={!signedIn}
              />
            ))}
          </Stack>
          <ApplicationSubmitButton canSubmit={data.canSubmit} />
        </Stack>
      )}
    </>
  );
};

export default ApplicationSteps;
