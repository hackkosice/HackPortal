import { PrismaClient } from "@prisma/client";

const getActiveHackathonId = async (
  prisma: PrismaClient
): Promise<number | null> => {
  const hackathons = await prisma.hackathon.findMany();
  const today = new Date();
  for (const hackathon of hackathons) {
    if (
      hackathon.applicationStartDate < today &&
      hackathon.applicationEndDate > today
    ) {
      return hackathon.id;
    }
  }
  return null;
};

export default getActiveHackathonId;
