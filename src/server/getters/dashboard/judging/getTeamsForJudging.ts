import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { prisma } from "@/services/prisma";

export type TeamForJudging = {
  nameAndTable: string;
  teamId: number;
};

const getTeamsForJudging = async (
  hackathonId: number
): Promise<TeamForJudging[]> => {
  await requireAdminSession();

  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          hackathonId,
        },
      },
      table: {
        hackathonId,
      },
    },
    select: {
      id: true,
      name: true,
      table: {
        select: {
          code: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return teams.map((team) => ({
    nameAndTable: `${team.name}${team.table ? ` (${team.table.code})` : ""}`,
    teamId: team.id,
  }));
};

export default getTeamsForJudging;
