import createFormValuesObject from "@/server/services/helpers/applications/createFormValuesObject";
import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { ApplicationStatus } from "@/services/types/applicationStatus";
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
export type ApplicationListData = {
  applications: ApplicationData[];
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
      id: application.id,
      hackerId: application.hacker.id,
      email: application.hacker.user.email,
      ...createFormValuesObject(application.formValues, formFields),
      score: calculateApplicationScore({ votes: application.votes }),
      team: application.hacker.team?.name ?? "",
      status: application.status.name as ApplicationStatus,
    },
  }));

  const applicationsSorted = applications.sort((a, b) => {
    if (a.properties.score > b.properties.score) {
      return -1;
    }
    if (a.properties.score < b.properties.score) {
      return 1;
    }
    return 0;
  });

  return {
    applications: applicationsSorted,
  };
};

export default getApplicationsList;
