import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import requireOrganizerSession from "@/server/services/helpers/requireOrganizerSession";

export type ApplicationFormStepsData = {
  id: number;
  title: string;
  position: number;
  hackathonId: number;
}[];
const getApplicationFormSteps = async (): Promise<ApplicationFormStepsData> => {
  await requireOrganizerSession();

  return prisma.applicationFormStep.findMany({
    orderBy: {
      position: SortOrder.asc,
    },
  });
};

export default getApplicationFormSteps;
