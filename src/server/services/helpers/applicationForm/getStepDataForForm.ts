import { FormFieldType } from "@/services/types/formFields";
import { prisma } from "@/services/prisma";

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
};

export type StepDataForForm = {
  title: string;
  description: string | null;
  position: number;
  formFields: FormFieldData[];
};

const getStepDataForForm = async (stepId: number): Promise<StepDataForForm> => {
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

  return {
    ...stepData,
    formFields: stepData.formFields.map((field) => ({
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
    })),
  };
};

export default getStepDataForForm;
