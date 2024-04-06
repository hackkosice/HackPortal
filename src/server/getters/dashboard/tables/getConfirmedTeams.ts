import { prisma } from "@/services/prisma";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;

export type TeamAndTable = {
  id: number;
  name: string;
  memberCount: number;
  tableCode?: string;
  challenges: {
    id: number;
    title: string;
  }[];
};

type TeamList = {
  fullyConfirmedTeams: TeamAndTable[];
  partiallyConfirmedTeams: TeamAndTable[];
};

const getConfirmedTeams = async (hackathonId: number): Promise<TeamList> => {
  const teams = await prisma.team.findMany({
    where: {
      members: {
        every: {
          hackathonId,
        },
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
      challenges: {
        select: {
          id: true,
          title: true,
        },
      },
      members: {
        select: {
          application: {
            select: {
              status: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      name: SortOrder.asc,
    },
  });

  const fullyConfirmedTeams: TeamAndTable[] = [];
  const partiallyConfirmedTeams: TeamAndTable[] = [];

  for (const team of teams) {
    if (team.members.length === 0) {
      continue;
    }
    const isFullyConfirmed = team.members.every(
      (member) =>
        member.application?.status.name === ApplicationStatusEnum.confirmed ||
        member.application?.status.name === ApplicationStatusEnum.attended
    );
    if (isFullyConfirmed) {
      fullyConfirmedTeams.push({
        id: team.id,
        name: team.name,
        memberCount: team.members.length,
        tableCode: team.table?.code,
        challenges: team.challenges.map((challenge) => ({
          id: challenge.id,
          title: challenge.title,
        })),
      });
      continue;
    }

    const isPartiallyConfirmed = team.members.some(
      (member) =>
        member.application?.status.name === ApplicationStatusEnum.confirmed ||
        member.application?.status.name === ApplicationStatusEnum.attended
    );

    if (isPartiallyConfirmed) {
      partiallyConfirmedTeams.push({
        id: team.id,
        name: team.name,
        memberCount: team.members.length,
        tableCode: team.table?.code,
        challenges: team.challenges.map((challenge) => ({
          id: challenge.id,
          title: challenge.title,
        })),
      });
    }
  }

  return { fullyConfirmedTeams, partiallyConfirmedTeams };
};

export default getConfirmedTeams;
