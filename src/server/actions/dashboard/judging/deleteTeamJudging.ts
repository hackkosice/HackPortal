"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";

type DeleteTeamJudgingInput = {
  teamJudgingId: number;
};
const deleteTeamJudging = async ({ teamJudgingId }: DeleteTeamJudgingInput) => {
  await requireAdminSession();

  await prisma.teamJudging.delete({
    where: {
      id: teamJudgingId,
    },
  });
};

export default deleteTeamJudging;
