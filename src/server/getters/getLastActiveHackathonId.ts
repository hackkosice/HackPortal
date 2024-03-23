import { PrismaClient } from "@prisma/client";
import { Prisma } from ".prisma/client";

const getLastActiveHackathonId = async (
  prisma: PrismaClient
): Promise<number | null> => {
  const latestHackathon = await prisma.hackathon.findFirst({
    orderBy: {
      eventStartDate: Prisma.SortOrder.desc,
    },
  });
  return latestHackathon?.id ?? null;
};

export default getLastActiveHackathonId;
