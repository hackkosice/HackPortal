import React from "react";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { trpc } from "@/services/trpc";
import { Button } from "@/components/ui/button";
import Step from "./components/Step";
import { Stack } from "@/components/Stack";
import Link from "next/link";

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
          {data?.data.map(({ title, id, position }) => (
            <Step key={id} stepId={id} title={title} position={position} />
          ))}
        </Stack>
        <Stack direction="column">
          <Button onClick={createNewStep}>Create new step</Button>
          <Button asChild size="small" variant="outline">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </Stack>
      </Card>
    </>
  );
};

export default ApplicationFormEditor;
