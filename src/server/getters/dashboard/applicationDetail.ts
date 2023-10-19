import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import createFormValuesObject from "@/server/services/helpers/createFormValuesObject";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import requireOrganizerSession from "@/server/services/helpers/requireOrganizerSession";

export type ApplicationDetailData = {
  id: number;
  status: string;
  values: { [p: string]: string };
};

const getApplicationDetail = async (
  applicationId: number
): Promise<ApplicationDetailData> => {
  await requireOrganizerSession();

  const application = await prisma.application.findUnique({
    select: {
      id: true,
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
    where: {
      id: applicationId,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  return {
    id: application.id,
    status: application.status.name,
    values: createFormValuesObject(application.formValues),
  };
};

export default getApplicationDetail;
