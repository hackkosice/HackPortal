"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Step from "./components/Step";
import { Stack } from "@/components/ui/stack";
import Link from "next/link";
import { ApplicationFormStepsData } from "@/server/getters/dashboard/applicationFormSteps";
import createNewStep from "@/server/actions/dashboard/createNewStep";

type ApplicationFormEditorProps = {
  applicationFormSteps: ApplicationFormStepsData;
};
const ApplicationFormEditor = ({
  applicationFormSteps,
}: ApplicationFormEditorProps) => {
  const onCreateNewStepClick = () => {
    createNewStep();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Form Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack direction="column" spaceAfter="medium" spacing="small">
          {applicationFormSteps.map(({ title, id, position }) => (
            <Step key={id} stepId={id} title={title} position={position} />
          ))}
        </Stack>
      </CardContent>
      <CardFooter>
        <Stack direction="column">
          <Button onClick={onCreateNewStepClick}>Create new step</Button>
          <Button asChild size="small" variant="outline">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </Stack>
      </CardFooter>
    </Card>
  );
};

export default ApplicationFormEditor;
