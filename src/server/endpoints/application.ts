import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import { isStepCompleted } from "@/server/services/helpers/isApplicationComplete";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export type ApplicationData = {
  message: string;
  signedIn: boolean;
  data: {
    application: {
      status: string;
    };
    steps: {
      id: number;
      title: string;
      stepNumber: number;
      isCompleted: boolean;
      formFields: {
        id: number;
        required: boolean;
        type: {
          value: string;
        };
      }[];
    }[];
    canSubmit: boolean;
  };
};

const getApplicationData = async (): Promise<ApplicationData> => {
  // Find all steps in the application form

  const session = await getServerSession(authOptions);

  const stepsDb = await prisma.applicationFormStep.findMany({
    select: {
      id: true,
      title: true,
      stepNumber: true,
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
      stepNumber: Prisma.SortOrder.asc,
    },
  });

  // User is not signed in

  if (!session?.id) {
    const steps = stepsDb.map((step) => ({
      ...step,
      isCompleted: false,
    }));

    return {
      message: "Application found",
      signedIn: false,
      data: {
        application: {
          status: "open",
        },
        steps,
        canSubmit: false,
      },
    };
  }

  // If user is signed in it must be a hacker

  // await requireHacker(ctx);

  const hacker = await prisma.hacker.findUnique({
    select: {
      id: true,
    },
    where: {
      userId: session.id,
    },
  });

  if (!hacker) {
    throw new Error("Hacker not found");
  }

  // Find application or create one if it doesn't exist

  const applicationSelect = {
    id: true,
    status: {
      select: {
        name: true,
      },
    },
  };

  let applicationObject = await prisma.application.findUnique({
    select: applicationSelect,
    where: {
      hackerId: hacker.id,
    },
  });

  if (!applicationObject) {
    applicationObject = await prisma.application.create({
      data: {
        hackerId: hacker.id,
        statusId: 1,
      },
      select: applicationSelect,
    });
  }

  // Find all application form field values in order to check which steps are completed

  const fieldValues = await prisma.applicationFormFieldValue.findMany({
    where: {
      applicationId: applicationObject.id,
    },
  });

  const steps = stepsDb.map((step) => ({
    ...step,
    isCompleted: isStepCompleted(step.formFields, fieldValues),
  }));

  // If all steps are completed, the application can be submitted

  const canSubmit = steps.every((step) => step.isCompleted);

  return {
    message: "Application found",
    signedIn: true,
    data: {
      application: {
        status: applicationObject.status.name,
      },
      steps,
      canSubmit,
    },
  };
};

export default getApplicationData;
