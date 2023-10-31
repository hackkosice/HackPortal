import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";

const requireHackerSession = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.id) {
    throw new Error("User has to be signed in");
  }

  const hacker = await prisma.hacker.findUnique({
    where: {
      userId: session.id,
    },
  });

  if (!hacker) {
    throw new Error("Hacker not found");
  }

  return hacker;
};

export default requireHackerSession;
