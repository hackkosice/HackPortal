import React from "react";
import { Text } from "@/components/ui/text";
import { Stack } from "@/components/ui/stack";
import ApplicationStep from "@/scenes/Application/components/ApplicationSteps/components/ApplicationStep";
import getApplicationData from "@/server/getters/application";
import ApplicationSubmitButton from "@/scenes/Application/components/ApplicationSteps/components/ApplicationSubmitButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import UnverifiedEmailAlert from "@/components/common/UnverifiedEmailAlert";

const ApplicationSteps = async () => {
  const {
    data,
    authStatus: { signedIn, emailVerified },
  } = await getApplicationData();
  return (
    <>
      {!signedIn && (
        <Alert variant="destructive">
          <AlertTitle>You are not signed in!</AlertTitle>
          <AlertDescription>Please create an account.</AlertDescription>
        </Alert>
      )}
      {signedIn && !emailVerified && <UnverifiedEmailAlert />}

      <Text>Application status: {data.application.status}</Text>
      {data.application.status === "open" && (
        <Stack spacing="medium" direction="column">
          <Text>Complete steps below to finish your application:</Text>
          <Stack
            direction="column"
            spaceAfter="medium"
            spacing="small"
            className="w-full"
          >
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
