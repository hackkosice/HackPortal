import { prisma } from "@/services/prisma";
import { ApplicationStatus } from "@/services/types/applicationStatus";
import { FormFieldTypesWithOptions } from "@/services/types/formFields";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;

export type OptionCount = {
  optionValue: string;
  count: number;
  percentage: number;
};

export type FieldStatistic = {
  fieldId: number;
  fieldLabel: string;
  fieldType: string;
  options: OptionCount[];
  totalResponses: number;
};

export type StepStatistics = {
  stepId: number;
  stepTitle: string;
  fields: FieldStatistic[];
};

export type ApplicationStatisticsData = {
  totalApplications: number;
  stepStatistics: StepStatistics[];
};

const getApplicationStatistics = async (
  hackathonId: number,
  statusFilter: ApplicationStatus | "all"
): Promise<ApplicationStatisticsData> => {
  const whereClause: Prisma.ApplicationWhereInput = {
    hacker: { hackathonId },
    ...(statusFilter !== "all" ? { status: { name: statusFilter } } : {}),
  };

  const applications = await prisma.application.findMany({
    select: {
      id: true,
      formValues: {
        select: {
          field: {
            select: {
              id: true,
              label: true,
              type: {
                select: {
                  value: true,
                },
              },
            },
          },
          option: {
            select: {
              value: true,
            },
          },
        },
      },
    },
    where: whereClause,
  });

  // Get all form fields that are select/dropdown types, grouped by step
  const formFields = await prisma.formField.findMany({
    select: {
      id: true,
      label: true,
      type: {
        select: {
          value: true,
        },
      },
      step: {
        select: {
          id: true,
          title: true,
          position: true,
        },
      },
    },
    where: {
      AND: [
        {
          step: {
            hackathonId,
          },
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
    orderBy: [
      {
        step: {
          position: SortOrder.asc,
        },
      },
      {
        position: SortOrder.asc,
      },
    ],
  });

  // Group fields by step
  const stepMap = new Map<
    number,
    { title: string; fields: FieldStatistic[] }
  >();

  for (const field of formFields) {
    const optionMap = new Map<string, number>();
    let totalResponses = 0;

    for (const application of applications) {
      const fieldValue = application.formValues.find(
        (fv) => fv.field.id === field.id
      );
      if (fieldValue && fieldValue.option) {
        const optionValue = fieldValue.option.value;
        optionMap.set(optionValue, (optionMap.get(optionValue) ?? 0) + 1);
        totalResponses++;
      }
    }

    if (totalResponses > 0) {
      const options: OptionCount[] = Array.from(optionMap.entries())
        .map(([optionValue, count]) => ({
          optionValue,
          count,
          percentage: (count / totalResponses) * 100,
        }))
        .sort((a, b) => b.count - a.count);

      const fieldStatistic: FieldStatistic = {
        fieldId: field.id,
        fieldLabel: field.label,
        fieldType: field.type.value,
        options,
        totalResponses,
      };

      if (!stepMap.has(field.step.id)) {
        stepMap.set(field.step.id, {
          title: field.step.title,
          fields: [],
        });
      }

      const stepEntry = stepMap.get(field.step.id);
      if (stepEntry) {
        stepEntry.fields.push(fieldStatistic);
      }
    }
  }

  // Convert map to array, preserving order
  const stepStatistics: StepStatistics[] = Array.from(stepMap.entries()).map(
    ([stepId, data]) => ({
      stepId,
      stepTitle: data.title,
      fields: data.fields,
    })
  );

  return {
    totalApplications: applications.length,
    stepStatistics,
  };
};

export default getApplicationStatistics;
