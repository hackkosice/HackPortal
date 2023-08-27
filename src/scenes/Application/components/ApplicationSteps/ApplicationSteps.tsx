import React from "react";
import { Text } from "@/components/Text";
import { Stack } from "@/components/Stack";
import ApplicationStep from "@/scenes/Application/components/ApplicationSteps/components/ApplicationStep";
import getApplicationData from "@/server/endpoints/application";
import ApplicationSubmitButton from "@/scenes/Application/components/ApplicationSteps/components/ApplicationSubmitButton";

const ApplicationSteps = async () => {
  const data = await getApplicationData();
  return (
    <>
      {!data.signedIn && (
        <Text type="error" weight="bold">
          You are not signed in.
        </Text>
      )}
      <Text>Application status: {data.data.application.status}</Text>
      {data.data.application.status === "open" && (
        <Stack spacing="medium" direction="column">
          <Text>Complete steps below to finish your application:</Text>
          <Stack direction="column" spaceAfter="medium" spacing="small">
            {data.data.steps.map((step) => (
              <ApplicationStep
                key={step.id}
                stepId={step.id}
                title={step.title}
                stepNumber={step.stepNumber}
                isCompleted={step.isCompleted}
              />
            ))}
          </Stack>
          <ApplicationSubmitButton canSubmit={data.data.canSubmit} />
        </Stack>
      )}
    </>
  );
};

export default ApplicationSteps;
