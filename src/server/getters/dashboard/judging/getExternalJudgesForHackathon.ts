import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { prisma } from "@/services/prisma";

export type ExternalJudgeWithAssignments = {
  id: number;
  name: string;
  accessToken: string;
  teamJudgings: {
    id: number;
    judgingSlot: {
      startTime: Date;
      endTime: Date;
    };
    team: {
      name: string;
      tableCode?: string;
    };
    judgingVerdict?: string | null;
  }[];
};

const getExternalJudgesForHackathon = async (
  hackathonId: number
): Promise<ExternalJudgeWithAssignments[]> => {
  await requireAdminSession();

  const judges = await prisma.externalJudge.findMany({
    where: { hackathonId },
    select: {
      id: true,
      name: true,
      accessToken: true,
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
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return judges.map((judge) => ({
    id: judge.id,
    name: judge.name,
    accessToken: judge.accessToken,
    teamJudgings: judge.teamJudgings.map((tj) => ({
      id: tj.id,
      judgingSlot: tj.judgingSlot,
      team: {
        name: tj.team.name,
        tableCode: tj.team.table?.code,
      },
      judgingVerdict: tj.judgingVerdict,
    })),
  }));
};

export default getExternalJudgesForHackathon;
