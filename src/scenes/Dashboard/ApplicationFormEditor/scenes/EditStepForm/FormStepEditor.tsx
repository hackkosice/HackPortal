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
import EditTitleDialog from "@/scenes/Dashboard/ApplicationFormEditor/scenes/EditStepForm/components/EditTitleDialog";
import StepFormField from "@/scenes/Dashboard/ApplicationFormEditor/scenes/EditStepForm/components/StepFormField";
import { Stack } from "@/components/ui/stack";
import NewFieldDialog from "@/scenes/Dashboard/ApplicationFormEditor/scenes/EditStepForm/components/NewFieldDialog";
import Link from "next/link";
import { StepInfoData } from "@/server/getters/dashboard/stepInfo";
import { FormFieldTypesData } from "@/server/getters/dashboard/formFieldTypes";

export type Props = {
  stepInfo: StepInfoData;
  formFieldTypes: FormFieldTypesData;
};

const FormStepEditor = ({
  stepInfo: { title, formFields, id },
  formFieldTypes,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <EditTitleDialog initialValue={title} stepId={id} />
      </CardHeader>
      <CardContent>
        <Heading size="small" spaceAfter="medium">
          Form fields
        </Heading>
        <Stack direction="column" spacing="small" spaceAfter="medium">
          {formFields.map(({ id, label, position, type, required }) => (
            <StepFormField
              key={id}
              fieldId={id}
              label={label}
              type={type}
              position={position}
              required={required}
            />
          ))}
        </Stack>
      </CardContent>
      <CardFooter>
        <Stack direction="column">
          <NewFieldDialog stepId={id} formFieldTypes={formFieldTypes} />
          <Button asChild variant="outline" size="small">
            <Link href="/dashboard/form-editor">Back to steps</Link>
          </Button>
        </Stack>
      </CardFooter>
    </Card>
  );
};

export default FormStepEditor;
