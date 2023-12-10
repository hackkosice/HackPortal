"use client";

import React, { useState } from "react";
import { Stack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import FormRenderer from "@/components/common/FormRenderer/FormRenderer";
import { ApplicationFormStepData } from "@/server/getters/application/applicationFormStep";
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
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import LogMount from "@/components/common/LogMount";
import useLog, { LogAction } from "@/services/hooks/useLog";

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
    data: {
      title,
      position,
      description,
      formFields,
      nextStepId,
      previousStepId,
    },
    signedIn,
  },
}: Props) => {
  const { log } = useLog();
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

    if (nextStepId) {
      push(`/application/form/step/${nextStepId}`);
      return;
    }
    push("/application");
  };

  return (
    <>
      <LogMount
        action={LogAction.PageDisplayed}
        detail="Application form step"
        data={{
          stepId,
          title,
        }}
      />
      <Stack
        direction="column"
        className="mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset w-full md:w-[50vw] md:min-w-[700px] mx-auto mb-20"
      >
        <Link
          href="/application"
          className="text-hkOrange"
          onClick={() => {
            log({
              action: LogAction.ButtonClicked,
              detail: "Back to application",
              data: {
                stepId,
                title,
              },
            });
          }}
        >
          <Stack direction="row" alignItems="center" spacing="small">
            <ChevronLeftIcon className="h-5 w-5" />
            Back to application
          </Stack>
        </Link>
        <Card className="mx-auto w-full mb-10">
          <CardHeader>
            <CardTitle>
              {position}. {title}
            </CardTitle>
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
                <Stack
                  direction="row"
                  className="w-full mt-5"
                  justify={previousStepId ? "between" : "end"}
                >
                  {previousStepId && (
                    <Button variant="outline" asChild>
                      <Link
                        href={`/application/form/step/${previousStepId}`}
                        onClick={() => {
                          log({
                            action: LogAction.ButtonClicked,
                            detail: "Previous step",
                            data: {
                              stepId,
                              title,
                            },
                          });
                        }}
                      >
                        <ChevronLeftIcon className="h-4 w-4 mr-2" />
                        Previous step
                      </Link>
                    </Button>
                  )}
                  {isSubmitting ? (
                    <Button disabled={true} className="px-6">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className={nextStepId ? "pl-6" : "px-6"}
                      onClick={() => {
                        log({
                          action: LogAction.ButtonClicked,
                          detail: "Save step",
                          data: {
                            stepId,
                            title,
                          },
                        });
                      }}
                    >
                      {nextStepId ? (
                        <>
                          Save and continue
                          <ChevronRightIcon className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  )}
                </Stack>
              }
            />
          </CardContent>
        </Card>
      </Stack>
    </>
  );
};

export default ApplicationFormStep;
