"use client";

import React from "react";
import { Stack } from "@/components/Stack";
import { Button } from "@/components/ui/button";
import FormRenderer from "@/scenes/ApplicationFormStep/components/FormRenderer";
import {
  ApplicationFormStepData,
  FormFieldValueType,
} from "@/server/getters/applicationFormStep";
import saveApplicationStepForm from "@/server/actions/saveApplicationStepForm";
import updateLocalApplicationData from "@/services/helpers/localData/updateLocalApplicationData";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Props = {
  data: ApplicationFormStepData;
};

const ApplicationFormStep = ({ data: { data, signedIn } }: Props) => {
  const { push } = useRouter();
  const onFormSubmit = async (formData: Record<string, FormFieldValueType>) => {
    const payload = Object.keys(formData)
      .filter((key) => formData[key] !== null)
      .map((key) => {
        return {
          fieldId: data.formFields.find((field) => field.name === key)
            ?.id as number,
          value: String(formData[key]),
        };
      });

    // If user is signedIn we can save the field values to the DB
    if (signedIn) {
      saveApplicationStepForm(payload);
      return;
    }

    // For unsigned users we will save the data to localStorage for later upload
    updateLocalApplicationData(payload);
    push("/application");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data?.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data && (
          <FormRenderer
            shouldUseLocalInitialValues={!signedIn}
            formFields={data.formFields}
            onSubmit={onFormSubmit}
            actionButtons={
              <Stack direction="row">
                <Button asChild variant="outline">
                  <Link href="/application">Back</Link>
                </Button>
                <Button type="submit">Save</Button>
              </Stack>
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationFormStep;
