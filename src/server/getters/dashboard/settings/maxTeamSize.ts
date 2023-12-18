import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";

const getMaxTeamSize = async (hackathonId: number): Promise<number> => {
  await requireAdminSession();

  const hackathon = await prisma.hackathon.findUnique({
    where: {
      id: hackathonId,
    },
    select: {
      maxTeamSize: true,
    },
  });

  if (!hackathon) {
    throw new Error("Hackathon not found");
  }

  return hackathon.maxTeamSize;
};

export default getMaxTeamSize;
