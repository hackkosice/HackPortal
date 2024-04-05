"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";

type CreateTeamJudgingInput = {
  organizerId: number;
  teamId: number;
  judgingSlotId: number;
};
const createTeamJudging = async ({
  judgingSlotId,
  teamId,
  organizerId,
}: CreateTeamJudgingInput) => {
  await requireAdminSession();

  await prisma.teamJudging.create({
    data: {
      judgingSlotId,
      teamId,
      organizerId,
    },
  });
};

export default createTeamJudging;
