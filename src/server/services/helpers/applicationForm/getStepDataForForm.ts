import { FormFieldType, FormFieldTypeEnum } from "@/services/types/formFields";
import { prisma } from "@/services/prisma";
import getPresignedUploadUrl from "@/services/fileUpload/getPresignedUploadUrl";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import createKeyForFormFileUpload from "@/server/services/helpers/fileUpload/createKeyForFormFileUpload";

export type FormFieldValueType = string | boolean | null;

export type FormFieldData = {
  id: number;
  position: number;
  name: string;
  label: string;
  description: string | null;
  type: FormFieldType;
  initialValue: FormFieldValueType;
  optionList: { value: string; label: string }[] | undefined;
  required: boolean;
  formFieldVisibilityRule: {
    targetFormFieldName: string;
    targetOptionId: number;
  } | null;
  fileUploadUrl: string | null;
  uploadedFileUrl?: string;
};

export type StepDataForForm = {
  title: string;
  description: string | null;
  position: number;
  formFields: FormFieldData[];
};

export type GetStepDataForFormParams = {
  stepId: number;
  shouldSendPresignedFileUploadUrls?: boolean;
};
const getStepDataForForm = async ({
  stepId,
  shouldSendPresignedFileUploadUrls = false,
}: GetStepDataForFormParams): Promise<StepDataForForm> => {
  const session = await getServerSession(authOptions);
  const userId = session?.id;
  const stepData = await prisma.applicationFormStep.findUnique({
    select: {
      id: true,
      title: true,
      description: true,
      position: true,
      formFields: {
        select: {
          id: true,
          position: true,
          label: true,
          name: true,
          description: true,
          required: true,
          type: {
            select: {
              value: true,
            },
          },
          optionList: {
            select: {
              options: {
                select: {
                  id: true,
                  value: true,
                },
              },
            },
          },
          formFieldVisibilityRule: {
            select: {
              targetFormField: {
                select: {
                  name: true,
                },
              },
              targetOptionId: true,
            },
          },
        },
      },
    },
    where: {
      id: stepId,
    },
  });

  if (!stepData) {
    throw new Error("Step not found");
  }

  const formFields = await Promise.all(
    stepData.formFields.map(async (field) => ({
      id: field.id,
      position: field.position,
      name: field.name,
      label: field.label,
      description: field.description,
      required: field.required,
      type: field.type.value as FormFieldType,
      initialValue: null,
      optionList: field.optionList?.options.map((option) => ({
        value: String(option.id),
        label: option.value,
      })),
      formFieldVisibilityRule: field.formFieldVisibilityRule
        ? {
            targetFormFieldName:
              field.formFieldVisibilityRule.targetFormField.name,
            targetOptionId: field.formFieldVisibilityRule.targetOptionId,
          }
        : null,
      fileUploadUrl:
        shouldSendPresignedFileUploadUrls &&
        field.type.value === FormFieldTypeEnum.file &&
        userId
          ? await getPresignedUploadUrl(
              createKeyForFormFileUpload({
                stepId,
                fieldId: field.id,
                userId: userId,
              })
            )
          : null,
    }))
  );

  return {
    ...stepData,
    formFields: formFields,
  };
};

export default getStepDataForForm;
