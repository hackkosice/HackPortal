import requireSponsorSession from "@/server/services/helpers/auth/requireSponsorSession";
import { prisma } from "@/services/prisma";
import {
  ApplicationStatus,
  ApplicationStatusEnum,
} from "@/services/types/applicationStatus";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import createFormValuesObject from "@/server/services/helpers/applications/createFormValuesObject";

export type ApplicationPropertySponsorList = {
  [key: string]: string | null | number | ApplicationStatus;
} & {
  id: number;
  email: string;
};

export type ApplicationDataSponsorList = {
  properties: ApplicationPropertySponsorList;
};

export type ApplicationListDataSponsorList = {
  applications: ApplicationDataSponsorList[];
};

const getApplicationsForSponsors = async (
  hackathonId: number
): Promise<ApplicationListDataSponsorList> => {
  await requireSponsorSession();

  const confirmedStatusId = await prisma.applicationStatus.findUnique({
    select: {
      id: true,
    },
    where: {
      name: ApplicationStatusEnum.confirmed,
    },
  });

  const attendedStatusId = await prisma.applicationStatus.findUnique({
    select: {
      id: true,
    },
    where: {
      name: ApplicationStatusEnum.attended,
    },
  });

  if (!confirmedStatusId || !attendedStatusId) {
    throw new Error("Confirmed status not found");
  }

  const applicationsDb = await prisma.application.findMany({
    select: {
      id: true,
      hacker: {
        select: {
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
              id: true,
              path: true,
            },
          },
        },
      },
    },
    where: {
      statusId: {
        in: [confirmedStatusId.id, attendedStatusId.id],
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
          shownInSponsorsViewTable: true,
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
      email: application.hacker.user.email,
      team: application.hacker.team?.name ?? "",
      ...createFormValuesObject(application.formValues, formFields),
    },
  }));

  return { applications };
};

export default getApplicationsForSponsors;
