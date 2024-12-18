import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import { isStepCompleted } from "@/server/services/helpers/applications/isApplicationComplete";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  ApplicationStatus,
  ApplicationStatusEnum,
} from "@/services/types/applicationStatus";
import SortOrder = Prisma.SortOrder;

export type ApplicationStepData = {
  id: number;
  title: string;
  position: number;
  isCompleted: boolean;
  formFields: {
    id: number;
    required: boolean;
    type: {
      value: string;
    };
  }[];
};

export type ApplicationData = {
  message: string;
  authStatus: {
    signedIn: boolean;
    emailVerified: boolean;
  } | null;
  data: {
    application: {
      status: ApplicationStatus;
    };
    steps: ApplicationStepData[];
    canSubmit: boolean;
    hackathonName: string;
    tableCode?: string;
    freeTables: string[];
  } | null;
};

type GetApplicationDataInput = {
  applicationId: number | null;
  hackathonId: number;
};
const getApplicationData = async ({
  hackathonId,
  applicationId,
}: GetApplicationDataInput): Promise<ApplicationData> => {
  // Find all steps in the application form

  const session = await getServerSession(authOptions);

  const stepsDb = await prisma.applicationFormStep.findMany({
    select: {
      id: true,
      title: true,
      position: true,
      formFields: {
        select: {
          id: true,
          required: true,
          type: {
            select: {
              value: true,
            },
          },
        },
      },
    },
    orderBy: {
      position: Prisma.SortOrder.asc,
    },
    where: {
      hackathonId,
    },
  });

  const hackathon = await prisma.hackathon.findUnique({
    select: {
      name: true,
    },
    where: {
      id: hackathonId,
    },
  });

  if (!hackathon) {
    throw new Error("Hackathon not found");
  }

  // User is not signed in

  if (!session?.id || !applicationId) {
    const steps = stepsDb.map((step) => ({
      ...step,
      isCompleted: false,
    }));

    return {
      message: "Application found",
      authStatus: {
        signedIn: false,
        emailVerified: false,
      },
      data: {
        application: {
          status: ApplicationStatusEnum.open,
        },
        steps,
        canSubmit: false,
        hackathonName: hackathon.name,
        freeTables: [],
      },
    };
  }

  // Find application or create one if it doesn't exist

  const application = await prisma.application.findUnique({
    select: {
      id: true,
      status: {
        select: {
          name: true,
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

  const user = await prisma.user.findUnique({
    select: {
      accounts: {
        select: {
          id: true,
        },
      },
      hacker: {
        select: {
          team: {
            select: {
              table: {
                select: {
                  code: true,
                },
              },
            },
          },
          hackathonId: true,
        },
      },
    },
    where: {
      id: session.id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Find all application form field values in order to check which steps are completed

  const fieldValues = await prisma.applicationFormFieldValue.findMany({
    where: {
      applicationId: application.id,
    },
  });

  const steps = stepsDb.map((step) => ({
    ...step,
    isCompleted: isStepCompleted(step.formFields, fieldValues),
  }));

  // If all steps are completed, the application can be submitted
  const canSubmit =
    steps.every((step) => step.isCompleted) && session.emailVerified;

  // Get list of all free tables if user doesn't have table assigned
  const hacker = user.hacker.find((h) => h.hackathonId === hackathonId);
  const tableCode = hacker?.team?.table?.code;
  let freeTables = [] as string[];
  if (!tableCode) {
    const tables = await prisma.table.findMany({
      where: {
        teams: {
          none: {},
        },
      },
      select: {
        code: true,
      },
      orderBy: {
        code: SortOrder.asc,
      },
    });
    freeTables = tables.map((table) => table.code);
  }

  return {
    message: "Application found",
    authStatus: {
      signedIn: true,
      emailVerified: session.emailVerified,
    },
    data: {
      application: {
        status: application.status.name as ApplicationStatus,
      },
      steps,
      canSubmit,
      hackathonName: hackathon.name,
      tableCode: user.hacker.find((h) => h.hackathonId === hackathonId)?.team
        ?.table?.code,
      freeTables,
    },
  };
};

export default getApplicationData;
