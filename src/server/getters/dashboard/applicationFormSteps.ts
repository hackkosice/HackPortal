import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

export type ApplicationFormStepsData = {
  id: number;
  title: string;
  position: number;
  hackathonId: number;
}[];
const getApplicationFormSteps = async (
  hackathonId: number
): Promise<ApplicationFormStepsData> => {
  await requireOrganizerSession();

  return prisma.applicationFormStep.findMany({
    orderBy: {
      position: SortOrder.asc,
    },
    where: {
      hackathonId,
    },
  });
};

export default getApplicationFormSteps;
