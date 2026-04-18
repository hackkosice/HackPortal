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

const getMyJudgings = async (
  hackathonId: number,
  forOrganizerId?: number
): Promise<MyJudgings> => {
  const organizer = await requireOrganizerSession();

  let organizerId = organizer.id;
  if (forOrganizerId !== undefined) {
    if (!organizer.isAdmin) {
      throw new Error("Only admins can view other organizer judgings");
    }
    organizerId = forOrganizerId;
  }
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

  let nextJudgingIndex = 0;
  for (let i = 0; i < judgings.length; i++) {
    if (!judgings[i].judgingVerdict) {
      nextJudgingIndex = i;
      break;
    }
  }
  return { judgings, nextJudgingIndex };
};

export default getMyJudgings;
