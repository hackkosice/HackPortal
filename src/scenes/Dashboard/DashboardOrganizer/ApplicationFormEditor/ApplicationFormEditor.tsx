import React from "react";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { trpc } from "@/services/trpc";
import { Button } from "@/components/Button";
import Step from "./components/Step";
import { Stack } from "@/components/Stack";

const ApplicationFormEditor = () => {
  const { data, isLoading } = trpc.steps.useQuery();
  const utils = trpc.useContext();
  const { mutateAsync: newStep } = trpc.newStep.useMutation({
    onSuccess: () => {
      utils.steps.invalidate();
    },
  });

  const createNewStep = () => {
    newStep();
  };

  return (
    <>
      <Card>
        <Heading centered spaceAfter="medium">
          Application Form Editor
        </Heading>
        {isLoading && <Text>Loading...</Text>}
        <Stack direction="column" spaceAfter="medium" spacing="small">
          {data?.data.map(({ title, id, stepNumber }) => (
            <Step key={id} stepId={id} title={title} stepNumber={stepNumber} />
          ))}
        </Stack>
        <Button label="Create new step" onClick={createNewStep} />
      </Card>
    </>
  );
};

export default ApplicationFormEditor;
