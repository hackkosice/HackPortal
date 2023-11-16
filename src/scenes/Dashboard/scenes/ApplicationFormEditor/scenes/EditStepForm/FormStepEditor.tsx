import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import EditTitleDialog from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/EditTitleDialog";
import { Stack } from "@/components/ui/stack";
import Link from "next/link";
import getStepInfo from "@/server/getters/dashboard/stepInfo";
import getFormFieldTypes from "@/server/getters/dashboard/formFieldTypes";
import getOptionLists from "@/server/getters/dashboard/optionListManager/getOptionLists";
import FormFieldsTable from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/FormFieldsTable";
import NewFieldButton from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/NewFieldButton";
import FormPreview from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/FormPreview";
import getStepDataForForm from "@/server/services/helpers/applicationForm/getStepDataForForm";

export type Props = {
  stepId: number;
  hackathonId: number;
};

const FormStepEditor = async ({ hackathonId, stepId }: Props) => {
  const { title, description, formFields } = await getStepInfo(stepId);
  const { formFields: formFieldsForPreview } = await getStepDataForForm(stepId);
  const formFieldTypes = await getFormFieldTypes();
  const optionLists = await getOptionLists();
  return (
    <Stack justify="center" className="flex-wrap">
      <Card className="w-full md:w-[60%]">
        <CardHeader>
          <Stack alignItems="center">
            <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
            <EditTitleDialog
              initialValue={{ title, description: description ?? "" }}
              stepId={stepId}
            />
          </Stack>
          {description && <Text>{description}</Text>}
        </CardHeader>
        <CardContent>
          <Heading size="small" spaceAfter="medium">
            Form fields
          </Heading>
          <FormFieldsTable
            formFields={formFields}
            formFieldTypes={formFieldTypes}
            optionLists={optionLists}
          />
        </CardContent>
        <CardFooter>
          <Stack direction="column">
            <NewFieldButton
              stepId={stepId}
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
      <Card className="w-full md:w-[30%]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Form preview</CardTitle>
        </CardHeader>
        <CardContent>
          <FormPreview formFields={formFieldsForPreview} />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default FormStepEditor;
