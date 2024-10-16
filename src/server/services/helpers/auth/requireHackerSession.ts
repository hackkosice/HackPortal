import "server-only";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import getActiveHackathonId from "@/server/getters/getActiveHackathonId";

type RequireHackerSessionOptions = {
  verified?: boolean;
};
const requireHackerSession = async ({
  verified = true,
}: RequireHackerSessionOptions = {}) => {
  const session = await getServerSession(authOptions);

  if (!session?.id) {
    throw new Error("User has to be signed in");
  }

  if (verified && !session.emailVerified) {
    throw new Error("User email not verified");
  }

  const hacker = await prisma.hacker.findFirst({
    where: {
      userId: session.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!hacker) {
    throw new Error("Hacker not found");
  }

  return hacker;
};

export default requireHackerSession;
