import { PrismaClient } from "@prisma/client";
import getActiveHackathonId from "@/server/getters/getActiveHackathonId";
import { randomBytes } from "crypto";

type AdditionalData = { githubProfileId?: number; password?: string };

type CreateHackerForActiveHackathonReturn = {
  user: {
    id: number;
    email: string;
    emailVerificationToken: string | null;
  };
  hackerId: number;
};

const userSelect = {
  id: true,
  emailVerificationToken: true,
  email: true,
};
const createHackerForActiveHackathon = async (
  prisma: PrismaClient,
  userEmail: string,
  additionalData?: AdditionalData
): Promise<CreateHackerForActiveHackathonReturn> => {
  let user = additionalData?.githubProfileId
    ? await prisma.user.findFirst({
        where: { githubId: additionalData?.githubProfileId },
        select: userSelect,
      })
    : await prisma.user.findFirst({
        where: { email: userEmail },
        select: userSelect,
      });

  if (!user) {
    const automaticallyVerified = Boolean(additionalData?.githubProfileId);
    const verificationToken = automaticallyVerified
      ? null
      : randomBytes(24).toString("hex");
    user = await prisma.user.create({
      data: {
        githubId: additionalData?.githubProfileId,
        password: additionalData?.password,
        email: userEmail ?? "",
        emailVerified: automaticallyVerified,
        emailVerificationToken: verificationToken,
      },
      select: userSelect,
    });
  }

  let hacker = await prisma.hacker.findFirst({
    where: { userId: user.id },
  });

  // Assuming there is always an active hackathon
  const activeHackathonId = await getActiveHackathonId(prisma);
  if (!activeHackathonId) {
    throw new Error("No active hackathon");
  }

  if (!hacker) {
    hacker = await prisma.hacker.create({
      data: {
        userId: user.id,
        hackathonId: activeHackathonId,
      },
    });
  }

  return {
    user,
    hackerId: hacker.id,
  };
};

export default createHackerForActiveHackathon;
