import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/services/prisma";

export type TeamData = {
  message: string;
  data: {
    team: {
      id: number;
      name: string;
      code: string;
    } | null;
  };
};

const getTeam = async (): Promise<TeamData> => {
  const session = await getServerSession(authOptions);

  if (!session?.id) {
    return {
      message: "User is not signed in",
      data: {
        team: null,
      },
    };
  }

  const hacker = await prisma.hacker.findUnique({
    select: {
      id: true,
      team: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
    where: {
      userId: session.id,
    },
  });

  if (!hacker) {
    throw new Error("Hacker not found");
  }

  return {
    message: "Successfully retrieved team",
    data: {
      team: hacker.team,
    },
  };
};

export default getTeam;
