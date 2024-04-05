import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { prisma } from "@/services/prisma";

type JudgeTeamJudging = {
  judgingSlot: {
    id: number;
    startTime: Date;
    endTime: Date;
  };
  team?: {
    teamJudgingId: number;
    id: number;
    name: string;
    tableCode?: string;
    challenges: string[];
  };
};

export type Judge = {
  id: number;
  name: string;
  teamJudgings: JudgeTeamJudging[];
};

export type Judges = {
  judges: Judge[];
};

const getJudges = async (hackathonId: number): Promise<Judges> => {
  await requireAdminSession();

  const judges = await prisma.organizer.findMany({
    select: {
      id: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      teamJudgings: {
        select: {
          id: true,
          judgingSlot: {
            select: {
              id: true,
              hackathonId: true,
              startTime: true,
              endTime: true,
            },
          },
          team: {
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
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const judgingSlots = await prisma.judgingSlot.findMany({
    where: {
      hackathonId,
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
    },
  });

  return {
    judges: judges
      .map((judge) => ({
        id: judge.id,
        name: judge.user.name ?? judge.user.email,
        teamJudgings: judgingSlots.map((judgingSlot) => {
          const teamJudging = judge.teamJudgings.find(
            (teamJudging) => teamJudging.judgingSlot.id === judgingSlot.id
          );
          return {
            judgingSlot,
            team: teamJudging?.team
              ? {
                  id: teamJudging.team.id,
                  teamJudgingId: teamJudging.id,
                  name: teamJudging.team.name,
                  tableCode: teamJudging.team.table?.code,
                  challenges: teamJudging.team.challenges.map(
                    (challenge) => challenge.title
                  ),
                }
              : undefined,
          };
        }),
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
};

export default getJudges;
