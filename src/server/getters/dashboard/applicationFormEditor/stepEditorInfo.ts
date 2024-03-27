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
  shouldBeShownInCheckin: boolean;
  shouldBeShownInSponsorsViewTable: boolean;
  shouldBeShownInSponsorsViewDetails: boolean;
  formFieldVisibilityRule: {
    targetFormField: {
      id: number;
      label: string;
    };
    targetOption: {
      id: number;
      value: string;
    };
  } | null;
};

export type StepInfoData = {
  title: string;
  description: string | null;
  formFields: FormFieldData[];
};

const getStepEditorInfo = async (stepId: number): Promise<StepInfoData> => {
  await requireOrganizerSession();

  const step = await prisma.applicationFormStep.findUnique({
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
          shownInCheckin: true,
          shownInSponsorsViewTable: true,
          shownInSponsorsViewDetails: true,
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
          formFieldVisibilityRule: {
            select: {
              targetFormField: {
                select: {
                  id: true,
                  label: true,
                },
              },
              targetOption: {
                select: {
                  id: true,
                  value: true,
                },
              },
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
      shouldBeShownInCheckin: field.shownInCheckin,
      shouldBeShownInSponsorsViewTable: field.shownInSponsorsViewTable,
      shouldBeShownInSponsorsViewDetails: field.shownInSponsorsViewDetails,
      optionList: field.optionList,
      position: field.position,
      type: field.type.value as FormFieldType,
      formFieldVisibilityRule: field.formFieldVisibilityRule,
    })),
  };
};

export default getStepEditorInfo;
