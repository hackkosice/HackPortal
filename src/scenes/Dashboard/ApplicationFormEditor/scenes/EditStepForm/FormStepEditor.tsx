import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { trpc } from "@/services/trpc";
import EditTitleDialog from "@/scenes/Dashboard/ApplicationFormEditor/scenes/EditStepForm/components/EditTitleDialog";
import StepFormField from "@/scenes/Dashboard/ApplicationFormEditor/scenes/EditStepForm/components/StepFormField";
import { Stack } from "@/components/ui/stack";
import NewFieldDialog from "@/scenes/Dashboard/ApplicationFormEditor/scenes/EditStepForm/components/NewFieldDialog";
import Link from "next/link";

export type Props = {
  stepId: number;
};

const FormStepEditor = ({ stepId }: Props) => {
  const { data } = trpc.stepInfo.useQuery({ id: stepId });
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data?.data.title}</CardTitle>
        <EditTitleDialog initialValue={data?.data.title} stepId={stepId} />
      </CardHeader>
      <CardContent>
        <Heading size="small" spaceAfter="medium">
          Form fields
        </Heading>
        <Stack direction="column" spacing="small" spaceAfter="medium">
          {data?.data.formFields.map(
            ({ id, label, position, type: { value }, required }) => (
              <StepFormField
                key={id}
                formFieldId={id}
                label={label}
                type={value}
                position={position}
                required={required}
              />
            )
          )}
        </Stack>
      </CardContent>
      <CardFooter>
        <Stack direction="column">
          <NewFieldDialog stepId={stepId} />
          <Button asChild variant="outline" size="small">
            <Link href="/dashboard/form-editor">Back to steps</Link>
          </Button>
        </Stack>
      </CardFooter>
    </Card>
  );
};

export default FormStepEditor;
