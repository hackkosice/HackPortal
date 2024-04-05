import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { prisma } from "@/services/prisma";

export type MyJudging = {
  id: number;
  startTime: Date;
  endTime: Date;
  team: {
    name: string;
    tableCode?: string;
    challenges: string[];
  };
  judgingVerdict?: string;
};

type MyJudgings = {
  judgings: MyJudging[];
  nextJudgingIndex: number;
};

const getMyJudgings = async (hackathonId: number): Promise<MyJudgings> => {
  const { id: organizerId } = await requireOrganizerSession();
  const judgingsDb = await prisma.teamJudging.findMany({
    where: {
      AND: [
        {
          judgingSlot: {
            hackathonId,
          },
        },
        {
          organizerId,
        },
      ],
    },
    select: {
      id: true,
      judgingVerdict: true,
      judgingSlot: {
        select: {
          id: true,
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
    orderBy: {
      judgingSlot: {
        startTime: "asc",
      },
    },
  });

  const judgings = judgingsDb.map((judging) => ({
    id: judging.id,
    startTime: judging.judgingSlot.startTime,
    endTime: judging.judgingSlot.endTime,
    team: {
      name: judging.team.name,
      tableCode: judging.team.table?.code,
      challenges: judging.team.challenges.map(({ title }) => title),
    },
    judgingVerdict: judging.judgingVerdict ?? undefined,
  }));

  let nextJudgingIndex = -1;
  for (let i = 0; i < judgings.length; i++) {
    if (!judgings[i].judgingVerdict) {
      nextJudgingIndex = i;
      break;
    }
  }
  return { judgings, nextJudgingIndex };
};

export default getMyJudgings;
