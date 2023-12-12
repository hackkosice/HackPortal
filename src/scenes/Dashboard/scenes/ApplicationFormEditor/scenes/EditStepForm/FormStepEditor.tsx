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
import EditTitleDialog from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/EditTitleDialog";
import { Stack } from "@/components/ui/stack";
import Link from "next/link";
import getStepEditorInfo from "@/server/getters/dashboard/applicationFormEditor/stepEditorInfo";
import getFormFieldTypes from "@/server/getters/dashboard/applicationFormEditor/formFieldTypes";
import getOptionLists from "@/server/getters/dashboard/optionListManager/getOptionLists";
import FormFieldsTable from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/FormFieldsTable";
import NewFieldButton from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/NewFieldButton";
import FormPreview from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/FormPreview";
import getStepDataForForm from "@/server/services/helpers/applicationForm/getStepDataForForm";
import MarkDownRenderer from "@/components/common/MarkDownRenderer";
import getPotentialVisibilityRuleTargets from "@/server/getters/dashboard/applicationFormEditor/potentialVisibilityRuleTargets";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export type Props = {
  stepId: number;
  hackathonId: number;
};

const FormStepEditor = async ({ hackathonId, stepId }: Props) => {
  const { title, description, formFields } = await getStepEditorInfo(stepId);
  const { formFields: formFieldsForPreview } = await getStepDataForForm({
    stepId,
  });
  const formFieldTypes = await getFormFieldTypes();
  const optionLists = await getOptionLists();
  const potentialVisibilityRuleTargets =
    await getPotentialVisibilityRuleTargets(stepId);
  return (
    <div className="md:w-[92vw] mx-auto">
      <Link
        href={`/dashboard/${hackathonId}/form-editor`}
        className="text-hkOrange"
      >
        <Stack direction="row" alignItems="center" spacing="small">
          <ChevronLeftIcon className="h-5 w-5" />
          Back to steps
        </Stack>
      </Link>
      <Stack direction="row" justify="center" className="flex-wrap mt-5">
        <Card className="w-full md:w-[60vw]">
          <CardHeader>
            <Stack alignItems="center">
              <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
              <EditTitleDialog
                initialValue={{ title, description: description ?? "" }}
                stepId={stepId}
              />
            </Stack>
            {description && (
              <Text>
                <MarkDownRenderer markdown={description} />
              </Text>
            )}
          </CardHeader>
          <CardContent>
            <Heading size="small" spaceAfter="medium">
              Form fields
            </Heading>
            <FormFieldsTable
              formFields={formFields}
              formFieldTypes={formFieldTypes}
              optionLists={optionLists}
              potentialVisibilityRuleTargets={potentialVisibilityRuleTargets}
            />
          </CardContent>
          <CardFooter>
            <NewFieldButton
              stepId={stepId}
              formFieldTypes={formFieldTypes}
              optionLists={optionLists}
              potentialVisibilityRuleTargets={potentialVisibilityRuleTargets}
            />
          </CardFooter>
        </Card>
        <Card className="w-full md:w-[30vw]">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Form preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormPreview formFields={formFieldsForPreview} />
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
};

export default FormStepEditor;
