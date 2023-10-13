"use client";

import React from "react";
import { Stack } from "@/components/Stack";
import { Button } from "@/components/ui/button";
import FormRenderer from "@/scenes/ApplicationFormStep/components/FormRenderer";
import { ApplicationFormStepData } from "@/server/getters/applicationFormStep";
import saveApplicationStepForm from "@/server/actions/saveApplicationStepForm";
import updateLocalApplicationData from "@/services/helpers/localData/updateLocalApplicationData";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Props = {
  data: ApplicationFormStepData;
};

const ApplicationFormStep = ({ data }: Props) => {
  const { push } = useRouter();
  const onFormSubmit = async (formData: Record<string, string>) => {
    const payload = Object.keys(formData)
      .map((key) => {
        return {
          fieldId: Number(key),
          value: formData[key].toString(),
        };
      })
      .filter((fieldValue) => fieldValue.value);

    // If user is signedIn we can save the field values to the DB
    if (data.signedIn) {
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
        <CardTitle>{data?.data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data && (
          <FormRenderer
            shouldUseLocalInitialValues={!data.signedIn}
            formFields={data.data.formFields}
            onSubmit={onFormSubmit}
            actionButtons={
              <Stack direction="row">
                <Button asChild variant="outline">
                  <Link href="/application">Back</Link>
                </Button>
                <Button asChild>
                  <input type="submit" value="Save" />
                </Button>
              </Stack>
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationFormStep;
