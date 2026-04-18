import requireSponsorSession from "@/server/services/helpers/auth/requireSponsorSession";
import { prisma } from "@/services/prisma";

export type MySponsorJudging = {
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

type MySponsorJudgings = {
  judgings: MySponsorJudging[];
  nextJudgingIndex: number;
};

const getSponsorJudgings = async (): Promise<MySponsorJudgings> => {
  const sponsor = await requireSponsorSession();

  const judgingsDb = await prisma.sponsorJudging.findMany({
    where: {
      sponsorId: sponsor.id,
      judgingSlot: {
        hackathonId: sponsor.hackathonId,
      },
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
            select: { code: true },
          },
          challenges: {
            select: { title: true },
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

  let nextJudgingIndex = 0;
  for (let i = 0; i < judgings.length; i++) {
    if (!judgings[i].judgingVerdict) {
      nextJudgingIndex = i;
      break;
    }
  }

  return { judgings, nextJudgingIndex };
};

export default getSponsorJudgings;
