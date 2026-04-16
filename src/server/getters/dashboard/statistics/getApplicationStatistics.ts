import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { ApplicationStatus } from "@/services/types/applicationStatus";

export type FieldOptionStatistic = {
  optionValue: string;
  count: number;
  percentage: number;
};

export type FieldStatistic = {
  fieldId: number;
  fieldLabel: string;
  totalResponses: number;
  options: FieldOptionStatistic[];
};

export type StepStatistic = {
  stepId: number;
  stepTitle: string;
  fields: FieldStatistic[];
};

export type ApplicationStatisticsData = {
  totalApplications: number;
  stepStatistics: StepStatistic[];
};

const getApplicationStatistics = async (
  hackathonId: number,
  status?: ApplicationStatus | "all"
): Promise<ApplicationStatisticsData> => {
  await requireOrganizerSession();

  const whereStatus =
    status && status !== "all"
      ? {
          status: {
            name: status,
          },
        }
      : {};

  const totalApplications = await prisma.application.count({
    where: {
      hacker: {
        hackathonId,
      },
      ...whereStatus,
    },
  });

  // Get all form steps with their dropdown fields (fields that have an optionList)
  const steps = await prisma.applicationFormStep.findMany({
    select: {
      id: true,
      title: true,
      formFields: {
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
          optionListId: {
            not: null,
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
    where: {
      hackathonId,
    },
    orderBy: {
      position: "asc",
    },
  });

  const stepStatistics: StepStatistic[] = [];

  for (const step of steps) {
    if (step.formFields.length === 0) continue;

    const fields: FieldStatistic[] = [];

    for (const field of step.formFields) {
      if (!field.optionList) continue;

      const allOptions = field.optionList.options;

      // Count responses for each option
      const optionCounts = await Promise.all(
        allOptions.map(async (option) => {
          const count = await prisma.applicationFormFieldValue.count({
            where: {
              fieldId: field.id,
              optionId: option.id,
              application: {
                hacker: {
                  hackathonId,
                },
                ...whereStatus,
              },
            },
          });
          return { optionValue: option.value, count };
        })
      );

      const totalResponses = optionCounts.reduce((sum, o) => sum + o.count, 0);

      const options: FieldOptionStatistic[] = optionCounts
        .filter((o) => o.count > 0)
        .map((o) => ({
          optionValue: o.optionValue,
          count: o.count,
          percentage: totalResponses > 0 ? (o.count / totalResponses) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count);

      if (totalResponses > 0) {
        fields.push({
          fieldId: field.id,
          fieldLabel: field.label,
          totalResponses,
          options,
        });
      }
    }

    if (fields.length > 0) {
      stepStatistics.push({
        stepId: step.id,
        stepTitle: step.title,
        fields,
      });
    }
  }

  return {
    totalApplications,
    stepStatistics,
  };
};

export default getApplicationStatistics;
