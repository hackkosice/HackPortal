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
import { ApplicationFormStepsData } from "@/server/getters/dashboard/applicationFormEditor/applicationFormSteps";
import createNewStep from "@/server/actions/dashboard/applicationFormEditor/createNewStep";
import { useToast } from "@/components/ui/use-toast";
import callServerAction from "@/services/helpers/server/callServerAction";

type ApplicationFormEditorProps = {
  applicationFormSteps: ApplicationFormStepsData;
  hackathonId: number;
};
const ApplicationFormEditor = ({
  applicationFormSteps,
  hackathonId,
}: ApplicationFormEditorProps) => {
  const { toast } = useToast();
  const onCreateNewStepClick = async () => {
    const res = await callServerAction(createNewStep, { hackathonId });
    if (!res.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message,
      });
      return;
    }
  };

  return (
    <Card className="md:w-[60%] mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Application Form Editor
        </CardTitle>
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
        </Stack>
      </CardFooter>
    </Card>
  );
};

export default ApplicationFormEditor;
