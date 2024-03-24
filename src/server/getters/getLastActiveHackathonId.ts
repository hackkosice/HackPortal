import { PrismaClient } from "@prisma/client";

const getLastActiveHackathonId = async (
  prisma: PrismaClient
): Promise<number | null> => {
  const latestHackathon = await prisma.hackathon.findFirst({
    orderBy: {
      eventStartDate: "desc",
    },
  });
  return latestHackathon?.id ?? null;
};

export default getLastActiveHackathonId;
