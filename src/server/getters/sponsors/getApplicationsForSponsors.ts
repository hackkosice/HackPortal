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
  const sponsor = await requireSponsorSession();

  if (sponsor.hackathonId !== hackathonId) {
    throw new Error("Sponsor does not have access to this hackathon");
  }

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

  if (!confirmedStatusId) {
    throw new Error("Application status 'confirmed' not found in DB");
  }
  if (!attendedStatusId) {
    throw new Error("Application status 'attended' not found in DB");
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
              name: true,
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
      ...createFormValuesObject(application.formValues, formFields),
      id: application.id,
      email: application.hacker.user.email,
      team: application.hacker.team?.name ?? "",
    },
  }));

  return { applications };
};

export default getApplicationsForSponsors;
