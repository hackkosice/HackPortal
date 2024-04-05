"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type DeleteTeamJudgingInput = {
  teamJudgingId: number;
};
const deleteTeamJudging = async ({ teamJudgingId }: DeleteTeamJudgingInput) => {
  await requireAdminSession();

  const {
    judgingSlot: { hackathonId },
  } = await prisma.teamJudging.delete({
    where: {
      id: teamJudgingId,
    },
    select: {
      judgingSlot: {
        select: {
          hackathonId: true,
        },
      },
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/judging/manage`, "page");
};

export default deleteTeamJudging;
