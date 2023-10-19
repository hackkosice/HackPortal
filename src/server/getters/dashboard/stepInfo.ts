import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import { FormFieldType } from "@/services/types/formFields";

export type StepInfoData = {
  title: string;
  id: number;
  formFields: {
    id: number;
    position: number;
    label: string;
    required: boolean;
    type: FormFieldType;
  }[];
};

const getStepInfo = async (stepId: number): Promise<StepInfoData> => {
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

  const step = await prisma.applicationFormStep.findFirst({
    where: {
      id: stepId,
    },
    select: {
      id: true,
      title: true,
      formFields: {
        select: {
          id: true,
          position: true,
          label: true,
          required: true,
          type: {
            select: {
              value: true,
            },
          },
        },
        orderBy: {
          position: SortOrder.asc,
        },
      },
    },
  });

  if (!step) {
    throw new Error("Step not found");
  }
  return {
    ...step,
    formFields: step.formFields.map((field) => ({
      ...field,
      type: field.type.value as FormFieldType,
    })),
  };
};

export default getStepInfo;
