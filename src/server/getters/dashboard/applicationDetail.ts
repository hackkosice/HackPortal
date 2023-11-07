import { prisma } from "@/services/prisma";
import createFormValuesObject, {
  ApplicationFormValuesObject,
} from "@/server/services/helpers/applications/createFormValuesObject";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

export type ApplicationDetailData = {
  id: number;
  status: string;
  values: ApplicationFormValuesObject;
};

const getApplicationDetail = async (
  applicationId: number
): Promise<ApplicationDetailData> => {
  await requireOrganizerSession();

  const application = await prisma.application.findUnique({
    select: {
      id: true,
      hacker: {
        select: {
          hackathonId: true,
        },
      },
      status: {
        select: {
          name: true,
        },
      },
      formValues: {
        orderBy: [
          {
            field: {
              step: {
                position: SortOrder.asc,
              },
            },
          },
          {
            field: {
              position: SortOrder.asc,
            },
          },
        ],
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
    },
    where: {
      id: applicationId,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  const formFields = await prisma.formField.findMany({
    select: {
      id: true,
      label: true,
    },
    where: {
      step: {
        hackathonId: application.hacker.hackathonId,
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

  return {
    id: application.id,
    status: application.status.name,
    values: createFormValuesObject(application.formValues, formFields),
  };
};

export default getApplicationDetail;
