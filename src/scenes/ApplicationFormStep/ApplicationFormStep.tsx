"use client";

import React, { useState } from "react";
import { Stack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import FormRenderer from "@/components/common/FormRenderer/FormRenderer";
import { ApplicationFormStepData } from "@/server/getters/applicationFormStep";
import saveApplicationStepForm from "@/server/actions/applicationForm/saveApplicationStepForm";
import updateLocalApplicationData from "@/services/helpers/localData/updateLocalApplicationData";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { FormFieldValueType } from "@/server/services/helpers/applicationForm/getStepDataForForm";
import MarkDownRenderer from "@/components/common/MarkDownRenderer";
import { FormFieldTypeEnum } from "@/services/types/formFields";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export type Props = {
  stepId: number;
  data: ApplicationFormStepData;
};

const uploadFile = async (file: File, url: string) => {
  await fetch(url, {
    method: "PUT",
    body: file,
  });
};

const ApplicationFormStep = ({
  stepId,
  data: {
    data: { title, description, formFields },
    signedIn,
  },
}: Props) => {
  const { push } = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);
  const onFormSubmit = async (
    formData: Record<string, FormFieldValueType | File>
  ) => {
    const shouldUseLocalData = !signedIn;
    let isSubmitSuccessful = true;
    const filledFields = Object.keys(formData).filter(
      (key) => formData[key] !== null
    );
    const payload = await Promise.all(
      filledFields.map(async (key) => {
        const formField = formFields.find((field) => field.name === key);
        const formFieldValue = formData[key];
        if (!formField) {
          throw new Error(`Form field ${key} not found`);
        }
        switch (formField.type) {
          case FormFieldTypeEnum.file:
            if (formField.fileUploadUrl) {
              const file = formFieldValue as File;
              try {
                await uploadFile(file, formField.fileUploadUrl);
              } catch (e) {
                setFormSubmitError(
                  "Error uploading file. Please try again later."
                );
                isSubmitSuccessful = false;
              }
              return {
                fieldId: formField.id,
                fieldType: formField.type,
                value: file.name,
              };
            } else {
              return {
                fieldId: formField.id,
                fieldType: formField.type,
                value: "",
              };
            }
          default:
            return {
              fieldId: formField.id,
              fieldType: formField.type,
              value: String(formFieldValue),
            };
        }
      })
    );

    if (!isSubmitSuccessful) {
      setIsSubmitting(false);
      return;
    }

    // For unsigned users we will save the data to localStorage for later upload
    if (shouldUseLocalData) {
      updateLocalApplicationData({
        fieldValues: payload,
        stepId,
      });
    }

    // If user is signedIn we can save the field values to the DB
    if (signedIn) {
      await saveApplicationStepForm({
        fieldValues: payload,
        stepId,
      });
    }

    setIsSubmitting(false);
    push("/application");
  };

  return (
    <Card className="mx-auto mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset w-full md:w-[50vw] md:min-w-[700px] mb-10">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <Text>
            <MarkDownRenderer markdown={description} />
          </Text>
        )}
      </CardHeader>
      <CardContent>
        {formSubmitError && (
          <Alert variant="destructive" className="mb-5">
            <AlertTitle>Error submitting the form!</AlertTitle>
            <AlertDescription>
              <Text size="small">{formSubmitError}</Text>
            </AlertDescription>
          </Alert>
        )}
        <FormRenderer
          shouldUseLocalInitialValues={!signedIn}
          formFields={formFields}
          onSubmit={(formData) => {
            setIsSubmitting(true);
            onFormSubmit(formData);
          }}
          className="w-full md:px-20"
          actionButtons={
            <Stack direction="row" className="w-full" justify="end">
              <Button asChild variant="outline">
                <Link href="/application">Back</Link>
              </Button>
              {isSubmitting ? (
                <Button disabled={true} className="px-6">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </Button>
              ) : (
                <Button type="submit" className="px-6">
                  Save
                </Button>
              )}
            </Stack>
          }
        />
      </CardContent>
    </Card>
  );
};

export default ApplicationFormStep;
