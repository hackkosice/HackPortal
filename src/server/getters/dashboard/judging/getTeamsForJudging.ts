import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { prisma } from "@/services/prisma";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";

export type TeamForJudging = {
  nameAndTable: string;
  teamId: number;
  hasCheckedInMember: boolean;
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
      members: {
        select: {
          application: {
            select: {
              status: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const mapped = teams.map((team) => ({
    nameAndTable: `${team.name}${team.table ? ` (${team.table.code})` : ""}`,
    teamId: team.id,
    hasCheckedInMember: team.members.some(
      (m) => m.application?.status.name === ApplicationStatusEnum.attended
    ),
  }));

  return [
    ...mapped.filter((t) => t.hasCheckedInMember),
    ...mapped.filter((t) => !t.hasCheckedInMember),
  ];
};

export default getTeamsForJudging;
