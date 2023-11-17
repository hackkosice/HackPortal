import { prisma } from "@/services/prisma";
import { FormFieldTypesWithOptions } from "@/services/types/formFields";

export type PotentialVisibilityRuleTarget = {
  id: number;
  label: string;
  options: {
    id: number;
    value: string;
  }[];
};
export type PotentialVisibilityRuleTargetsData =
  PotentialVisibilityRuleTarget[];

const getPotentialVisibilityRuleTargets = async (stepId: number) => {
  const formFields = await prisma.formField.findMany({
    select: {
      id: true,
      label: true,
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
    where: {
      AND: [
        {
          stepId,
        },
        {
          type: {
            value: {
              in: FormFieldTypesWithOptions,
            },
          },
        },
      ],
    },
  });

  return formFields.map((formField) => ({
    id: formField.id,
    label: formField.label,
    options:
      formField.optionList?.options.map((option) => ({
        id: option.id,
        value: option.value,
      })) ?? [],
  }));
};

export default getPotentialVisibilityRuleTargets;
