import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import { FormFieldType } from "@/services/types/formFields";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

export type FormFieldData = {
  id: number;
  position: number;
  label: string;
  description: string | null;
  name: string;
  required: boolean;
  optionList: {
    id: number;
    name: string;
  } | null;
  type: FormFieldType;
  shouldBeShownInList: boolean;
};

export type StepInfoData = {
  title: string;
  description: string | null;
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
      description: true,
      formFields: {
        select: {
          id: true,
          position: true,
          label: true,
          description: true,
          shownInList: true,
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
      id: field.id,
      label: field.label,
      description: field.description,
      name: field.name,
      required: field.required,
      shouldBeShownInList: field.shownInList,
      optionList: field.optionList,
      position: field.position,
      type: field.type.value as FormFieldType,
    })),
  };
};

export default getStepInfo;
