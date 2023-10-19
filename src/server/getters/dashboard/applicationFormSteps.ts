import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;

export type ApplicationFormStepsData = {
  id: number;
  title: string;
  position: number;
  hackathonId: number;
}[];
const getApplicationFormSteps = async (): Promise<ApplicationFormStepsData> => {
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

  return prisma.applicationFormStep.findMany({
    orderBy: {
      position: SortOrder.asc,
    },
  });
};

export default getApplicationFormSteps;
