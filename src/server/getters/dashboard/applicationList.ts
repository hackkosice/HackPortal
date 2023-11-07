import createFormValuesObject, {
  ApplicationFormValuesObject,
} from "@/server/services/helpers/applications/createFormValuesObject";
import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { ApplicationStatus } from "@/services/types/applicationStatus";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import calculateApplicationScore from "@/server/services/helpers/applications/calculateApplicationScore";

export type ApplicationData = {
  properties: ApplicationFormValuesObject;
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
      step: {
        hackathonId,
      },
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
      id: application.id.toString(),
      score: calculateApplicationScore({ votes: application.votes }).toString(),
      team: null,
      status: application.status.name as ApplicationStatus,
    },
  }));

  return {
    applications,
  };
};

export default getApplicationsList;
