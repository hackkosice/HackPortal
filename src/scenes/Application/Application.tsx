import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { trpc } from "@/services/trpc";
import React, { useState } from "react";
import { Stack } from "@/components/Stack";
import { Button } from "@/components/Button";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import HackerApplicationStep from "@/scenes/Application/components/HackerApplicationStep";

const Application = () => {
  const utils = trpc.useContext();
  const { data } = trpc.application.useQuery();
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
        <Stack direction="column">
          <Heading centered>Welcome to Hack Kosice Application portal!</Heading>
          {data && data.signedIn === false && (
            <Text type="error" weight="bold">
              You are not signed in.
            </Text>
          )}
          <Text>Application status: {data?.data.application.status.name}</Text>
          {data?.data.application.status.name === "open" && (
            <Stack spacing="medium" direction="column">
              <Text>Complete steps below to finish your application:</Text>
              <Stack direction="column" spaceAfter="medium" spacing="small">
                {data?.data.steps.map((step) => (
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
                disabled={!data?.data.canSubmit}
                onClick={() => setSubmitConfirmationModalOpened(true)}
              />
            </Stack>
          )}
        </Stack>
      </Card>
    </>
  );
};

export default Application;
