import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import { FormFieldType } from "@/services/types/formFields";
import requireOrganizerSession from "@/server/services/helpers/requireOrganizerSession";

export type FormFieldData = {
  id: number;
  position: number;
  label: string;
  name: string;
  required: boolean;
  optionList: {
    id: number;
    name: string;
  } | null;
  type: FormFieldType;
};

export type StepInfoData = {
  title: string;
  formFields: FormFieldData[];
};

const getStepInfo = async (stepId: number): Promise<StepInfoData> => {
  await requireOrganizerSession();

  const step = await prisma.applicationFormStep.findFirst({
    where: {
      id: stepId,
    },
    select: {
      title: true,
      formFields: {
        select: {
          id: true,
          position: true,
          label: true,
          name: true,
          required: true,
          type: {
            select: {
              value: true,
            },
          },
          optionList: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          position: SortOrder.asc,
        },
      },
    },
  });

  if (!step) {
    throw new Error("Step not found");
  }
  return {
    ...step,
    formFields: step.formFields.map((field) => ({
      ...field,
      type: field.type.value as FormFieldType,
    })),
  };
};

export default getStepInfo;
