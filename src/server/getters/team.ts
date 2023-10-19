import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import requireAnySession from "@/server/services/helpers/requireAnySession";

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
  const sessionId = await requireAnySession();
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
      userId: sessionId,
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
