import React from "react";
import { Stack } from "@/components/ui/stack";
import ApplicationStepCard from "@/scenes/Application/components/ApplicationForm/components/ApplicationStepCard";
import getApplicationData from "@/server/getters/application";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import UnverifiedEmailAlert from "@/components/common/UnverifiedEmailAlert";
import ApplicationStatusCard from "@/scenes/Application/components/ApplicationForm/components/ApplicationStatusCard";
import { Heading } from "@/components/ui/heading";

const ApplicationForm = async () => {
  const {
    data,
    authStatus: { signedIn, emailVerified },
  } = await getApplicationData();
  return (
    <Stack className="w-full" direction="column">
      <Heading className="mx-auto">
        Your application for Hack Kosice 2024:
      </Heading>
      {!signedIn && (
        <Alert variant="destructive">
          <AlertTitle>You are not signed in!</AlertTitle>
          <AlertDescription>Please create an account.</AlertDescription>
        </Alert>
      )}
      {signedIn && !emailVerified && <UnverifiedEmailAlert />}

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
                shouldUseLocalIsCompleted={!signedIn}
              />
            ))}
            <ApplicationStepCard key="submit" step="submit" />
          </Stack>
        </div>
      )}
    </Stack>
  );
};

export default ApplicationForm;
