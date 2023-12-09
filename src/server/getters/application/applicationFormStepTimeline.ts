import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";

type ApplicationFormStepTimelineData = {
  id: string;
  name: string;
  position: number;
  isComplete: boolean;
};

const getApplicationFormStepTimeline = async (hackathonId: number) => {
  const session = await getServerSession(authOptions);

  const steps = await prisma.applicationFormStep.findMany({
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

  if (!session?.id) {
    return {
      message: "Steps found",
      signedIn: false,
      data: [],
    };
  }
};

export default getApplicationFormStepTimeline;
