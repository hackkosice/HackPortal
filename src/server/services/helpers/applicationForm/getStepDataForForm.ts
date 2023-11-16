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
      ...field,
      type: field.type.value as FormFieldType,
      initialValue: null,
      optionList: field.optionList?.options.map((option) => ({
        value: String(option.id),
        label: option.value,
      })),
    })),
  };
};

export default getStepDataForForm;
