import createFormValuesObject from "@/server/services/helpers/createFormValuesObject";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";

export type ApplicationListData = {
  applications: {
    id: number;
    status: string;
    values: { [p: string]: string };
  }[];
};

const getApplicationsList = async (): Promise<ApplicationListData> => {
  const session = await getServerSession(authOptions);

  if (!session?.id) {
    throw new Error("User has to be signed in");
  }

  const organizer = await prisma.organizer.findUnique({
    where: {
      userId: session.id,
    },
  });

  if (!organizer) {
    throw new Error("Organizer not found");
  }

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
