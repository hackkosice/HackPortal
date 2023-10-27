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
import EditTitleDialog from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/EditTitleDialog";
import StepFormField from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/StepFormField";
import { Stack } from "@/components/ui/stack";
import NewFieldDialog from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/NewFieldDialog";
import Link from "next/link";
import { StepInfoData } from "@/server/getters/dashboard/stepInfo";
import getFormFieldTypes from "@/server/getters/dashboard/formFieldTypes";
import getOptionLists from "@/server/getters/dashboard/optionListManager/getOptionLists";

export type Props = {
  stepInfo: StepInfoData;
  hackathonId: number;
};

const FormStepEditor = async ({
  stepInfo: { title, formFields, id },
  hackathonId,
}: Props) => {
  const formFieldTypes = await getFormFieldTypes();
  const optionLists = await getOptionLists();
  return (
    <Card className="md:w-[60%] mx-auto">
      <CardHeader>
        <Stack alignItems="center">
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
          <EditTitleDialog initialValue={title} stepId={id} />
        </Stack>
      </CardHeader>
      <CardContent>
        <Heading size="small" spaceAfter="medium">
          Form fields
        </Heading>
        <Stack direction="column" spacing="small" spaceAfter="medium">
          {formFields.map((formField) => (
            <StepFormField
              key={formField.id}
              formField={formField}
              formFieldTypes={formFieldTypes}
              optionLists={optionLists}
            />
          ))}
        </Stack>
      </CardContent>
      <CardFooter>
        <Stack direction="column">
          <NewFieldDialog
            stepId={id}
            formFieldTypes={formFieldTypes}
            optionLists={optionLists}
          />
          <Button asChild variant="outline" size="small">
            <Link href={`/dashboard/${hackathonId}/form-editor`}>
              Back to steps
            </Link>
          </Button>
        </Stack>
      </CardFooter>
    </Card>
  );
};

export default FormStepEditor;
