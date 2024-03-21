import { PrismaClient } from "@prisma/client";

const getLastActiveHackathonId = async (
  prisma: PrismaClient
): Promise<number | null> => {
  const hackathons = await prisma.hackathon.findMany();

  // If no hackathons have been organized yet
  if (hackathons.length === 0) return null;

  const latestHackathon = hackathons.sort(
    (a, b) =>
      new Date(b.eventStartDate).getTime() -
      new Date(a.eventStartDate).getTime()
  )[0];
  return latestHackathon.id;
};

export default getLastActiveHackathonId;
