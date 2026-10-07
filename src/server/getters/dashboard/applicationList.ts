import createFormValuesObject from "@/server/services/helpers/applications/createFormValuesObject";
import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { ApplicationStatus } from "@/services/types/applicationStatus";
import {
  FormFieldType,
  FormFieldTypeEnum,
  FormFieldTypesWithOptions,
} from "@/services/types/formFields";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import calculateApplicationScore, {
  ApplicationScore,
} from "@/server/services/helpers/applications/calculateApplicationScore";

export type ApplicationProperty = {
  [key: string]: string | null | ApplicationScore | number | ApplicationStatus;
} & {
  id: number;
  hackerId: number;
  email: string;
  score: ApplicationScore;
  status: ApplicationStatus;
};

export type ApplicationData = {
  properties: ApplicationProperty;
};
// options === null means free text filter, otherwise the column is filtered by picking from options
export type ApplicationFilter = {
  column: string;
  options: string[] | null;
};
export type ApplicationListData = {
  applications: ApplicationData[];
  filters: ApplicationFilter[];
};

const getFilterOptions = (
  type: string,
  optionList: { options: { value: string }[] } | null
): string[] | null => {
  const options = optionList?.options.map((option) => option.value) ?? [];
  if (
    FormFieldTypesWithOptions.includes(type as FormFieldType) &&
    options.length > 0
  ) {
    return Array.from(new Set(options));
  }
  if (type === FormFieldTypeEnum.checkbox) {
    return ["true", "false"];
  }
  return null;
};

const getApplicationsList = async (
  hackathonId: number
): Promise<ApplicationListData> => {
  await requireOrganizerSession();

  const applicationsDb = await prisma.application.findMany({
    select: {
      id: true,
      hacker: {
        select: {
          id: true,
          team: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              email: true,
            },
          },
        },
      },
      status: {
        select: {
          name: true,
        },
      },
      formValues: {
        select: {
          value: true,
          field: {
            select: {
              id: true,
            },
          },
          option: {
            select: {
              value: true,
            },
          },
          file: {
            select: {
              name: true,
              path: true,
            },
          },
        },
      },
      votes: {
        select: {
          voteParameter: {
            select: {
              weight: true,
            },
          },
          organizerId: true,
          value: true,
        },
      },
    },
    where: {
      hacker: {
        hackathonId,
      },
    },
  });

  const formFields = await prisma.formField.findMany({
    select: {
      id: true,
      label: true,
      type: {
        select: {
          value: true,
        },
      },
      optionList: {
        select: {
          options: {
            select: {
              value: true,
            },
          },
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
          shownInList: true,
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

  const applications = applicationsDb.map((application) => ({
    properties: {
      ...createFormValuesObject(application.formValues, formFields),
      id: application.id,
      hackerId: application.hacker.id,
      email: application.hacker.user.email,
      score: calculateApplicationScore({ votes: application.votes }),
      team: application.hacker.team?.name ?? "",
      status: application.status.name as ApplicationStatus,
    },
  }));

  const applicationsSorted = applications.sort(
    (a, b) => b.properties.score.score - a.properties.score.score
  );

  const filters: ApplicationFilter[] = [
    ...formFields.map((field) => ({
      column: field.label,
      options: getFilterOptions(field.type.value, field.optionList),
    })),
    { column: "id", options: null },
    { column: "email", options: null },
    { column: "team", options: null },
  ];

  return {
    applications: applicationsSorted,
    filters,
  };
};

export default getApplicationsList;
