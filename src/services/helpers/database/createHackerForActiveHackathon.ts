import { PrismaClient } from "@prisma/client";
import getActiveHackathonId from "@/server/getters/getActiveHackathonId";

type AdditionalData = { githubProfileId?: number; password?: string };

type CreateHackerForActiveHackathonReturn = {
  userId: number;
  hackerId: number;
};
const createHackerForActiveHackathon = async (
  prisma: PrismaClient,
  userEmail: string,
  additionalData?: AdditionalData
): Promise<CreateHackerForActiveHackathonReturn> => {
  let user = additionalData?.githubProfileId
    ? await prisma.user.findFirst({
        where: { githubId: additionalData?.githubProfileId },
      })
    : await prisma.user.findFirst({
        where: { email: userEmail },
      });

  if (!user) {
    user = await prisma.user.create({
      data: {
        githubId: additionalData?.githubProfileId,
        password: additionalData?.password,
        email: userEmail ?? "",
      },
    });
  }

  let hacker = await prisma.hacker.findFirst({
    where: { userId: user.id },
  });

  // Assuming there is always an active hackathon
  const activeHackathonId = (await getActiveHackathonId(prisma)) as number;

  if (!hacker) {
    hacker = await prisma.hacker.create({
      data: {
        userId: user.id,
        hackathonId: activeHackathonId,
      },
    });
  }

  return {
    userId: user.id,
    hackerId: hacker.id,
  };
};

export default createHackerForActiveHackathon;
