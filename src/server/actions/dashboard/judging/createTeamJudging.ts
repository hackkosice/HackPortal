"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

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

  const judgingSlot = await prisma.judgingSlot.findUnique({
    where: {
      id: judgingSlotId,
    },
    select: { hackathonId: true },
  });

  if (!judgingSlot) {
    throw new Error("Judging slot not found");
  }

  const existingTeamJudging = await prisma.teamJudging.findFirst({
    where: {
      judgingSlotId,
      teamId,
    },
    select: {
      id: true,
    },
  });

  if (existingTeamJudging) {
    throw new ExpectedServerActionError(
      "Team already assigned to this judging slot"
    );
  }

  await prisma.teamJudging.create({
    data: {
      judgingSlotId,
      teamId,
      organizerId,
    },
  });

  revalidatePath(
    `/dashboard/${judgingSlot.hackathonId}/judging/manage`,
    "page"
  );
};

export default createTeamJudging;
