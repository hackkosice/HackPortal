import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { trpc } from "@/services/trpc";
import { Button } from "@/components/ui/button";
import Step from "./components/Step";
import { Stack } from "@/components/ui/stack";
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
    <Card>
      <CardHeader>
        <CardTitle>Application Form Editor</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <Text>Loading...</Text>}
        <Stack direction="column" spaceAfter="medium" spacing="small">
          {data?.data.map(({ title, id, position }) => (
            <Step key={id} stepId={id} title={title} position={position} />
          ))}
        </Stack>
      </CardContent>
      <CardFooter>
        <Stack direction="column">
          <Button onClick={createNewStep}>Create new step</Button>
          <Button asChild size="small" variant="outline">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </Stack>
      </CardFooter>
    </Card>
  );
};

export default ApplicationFormEditor;
