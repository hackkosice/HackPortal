import { prisma } from "@/services/prisma";

export type ExternalJudgingTeamJudging = {
  id: number;
  startTime: Date;
  endTime: Date;
  team: {
    name: string;
    tableCode?: string;
    challenges: string[];
  };
  judgingVerdict?: string | null;
};

export type ExternalJudgingData = {
  judgeId: number;
  judgeName: string;
  hackathonName: string;
  teamJudgings: ExternalJudgingTeamJudging[];
};

const getExternalJudgingByToken = async (
  accessToken: string
): Promise<ExternalJudgingData | null> => {
  const judge = await prisma.externalJudge.findUnique({
    where: { accessToken },
    select: {
      id: true,
      name: true,
      hackathon: { select: { name: true } },
      teamJudgings: {
        select: {
          id: true,
          judgingVerdict: true,
          judgingSlot: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
          team: {
            select: {
              name: true,
              table: { select: { code: true } },
              challenges: {
                select: { title: true },
              },
            },
          },
        },
        orderBy: { judgingSlot: { startTime: "asc" } },
      },
    },
  });

  if (!judge) {
    return null;
  }

  return {
    judgeId: judge.id,
    judgeName: judge.name,
    hackathonName: judge.hackathon.name,
    teamJudgings: judge.teamJudgings.map((tj) => ({
      id: tj.id,
      startTime: tj.judgingSlot.startTime,
      endTime: tj.judgingSlot.endTime,
      team: {
        name: tj.team.name,
        tableCode: tj.team.table?.code,
        challenges: tj.team.challenges.map((c) => c.title),
      },
      judgingVerdict: tj.judgingVerdict,
    })),
  };
};

export default getExternalJudgingByToken;
