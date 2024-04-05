import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;

type JudgingSlot = {
  id: number;
  startTime: Date;
  endTime: Date;
};

export type JudgingSlots = {
  judgingSlots: JudgingSlot[];
};

const getJudgingSlots = async (hackathonId: number): Promise<JudgingSlots> => {
  const judgingSlots = await prisma.judgingSlot.findMany({
    where: {
      hackathonId,
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
    },
    orderBy: {
      startTime: SortOrder.asc,
    },
  });

  return {
    judgingSlots,
  };
};

export default getJudgingSlots;
