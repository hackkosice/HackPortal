import "server-only";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";

const requireOrganizerSession = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.id) {
    throw new Error("User has to be signed in");
  }

  const user = await prisma.user.findFirst({
    select: {
      organizer: true,
      accounts: {
        select: {
          id: true,
        },
      },
    },
    where: {
      id: session.id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!session.emailVerified) {
    throw new Error("User has to verify their email");
  }

  if (!user.organizer) {
    throw new Error("Organizer not found");
  }

  return user.organizer;
};

export default requireOrganizerSession;
