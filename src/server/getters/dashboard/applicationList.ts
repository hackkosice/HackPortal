import createFormValuesObject from "@/server/services/helpers/applications/createFormValuesObject";
import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

export type ApplicationListData = {
  applications: {
    id: number;
    status: string;
    values: { [p: string]: string };
  }[];
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

  const applications = applicationsDb.map((application) => ({
    id: application.id,
    status: application.status.name,
    values: createFormValuesObject(application.formValues),
  }));

  return {
    applications,
  };
};

export default getApplicationsList;
