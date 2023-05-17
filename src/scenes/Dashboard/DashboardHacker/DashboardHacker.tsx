import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { trpc } from "@/services/trpc";
import React, { useState } from "react";
import { Stack } from "@/components/Stack";
import { Button } from "@/components/Button";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import HackerApplicationStep from "@/scenes/Dashboard/DashboardHacker/components/HackerApplicationStep";

const DashboardHacker = () => {
  const utils = trpc.useContext();
  const { data: dataSteps } = trpc.stepsHacker.useQuery();
  const { data: dataApplication } = trpc.application.useQuery();
  const { mutateAsync: submitApplication } = trpc.submitApplication.useMutation(
    {
      onSuccess: () => {
        utils.application.invalidate();
      },
    }
  );
  const [submitConfirmationModalOpened, setSubmitConfirmationModalOpened] =
    useState(false);
  const onSubmitConfirmationClose = async (value: boolean) => {
    if (value) {
      await submitApplication();
    }
    setSubmitConfirmationModalOpened(false);
  };
  return (
    <>
      <ConfirmationModal
        question={
          "Are you sure you want to submit your application? After submitting the application will be locked for changes. You can still join, create and manage your team."
        }
        isOpened={submitConfirmationModalOpened}
        onClose={onSubmitConfirmationClose}
      />
      <Card>
        <Heading spaceAfter="large" centered>
          Welcome to Hack Kosice Application portal!
        </Heading>
        <Text spaceAfter="large">
          Application status: {dataApplication?.data.status.name}
        </Text>
        {dataApplication?.data.status.name === "open" && (
          <>
            <Text spaceAfter="medium">
              Complete steps below to finish your application:
            </Text>
            <Stack direction="column" spaceAfter="medium" spacing="small">
              {dataSteps?.data.steps.map((step) => (
                <HackerApplicationStep
                  key={step.id}
                  stepId={step.id}
                  title={step.title}
                  stepNumber={step.stepNumber}
                  isCompleted={step.isCompleted}
                />
              ))}
            </Stack>
            <Button
              label="Submit application"
              disabled={!dataSteps?.data.canSubmit}
              onClick={() => setSubmitConfirmationModalOpened(true)}
            />
          </>
        )}
      </Card>
    </>
  );
};

export default DashboardHacker;
