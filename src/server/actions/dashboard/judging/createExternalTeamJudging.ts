"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

type CreateExternalTeamJudgingInput = {
  externalJudgeId: number;
  teamId: number;
  judgingSlotId: number;
};

const createExternalTeamJudging = async ({
  externalJudgeId,
  teamId,
  judgingSlotId,
}: CreateExternalTeamJudgingInput) => {
  await requireAdminSession();

  const judgingSlot = await prisma.judgingSlot.findUnique({
    where: { id: judgingSlotId },
    select: { hackathonId: true },
  });

  if (!judgingSlot) {
    throw new Error("Judging slot not found");
  }

  const existing = await prisma.externalTeamJudging.findFirst({
    where: { externalJudgeId, judgingSlotId },
    select: { id: true },
  });

  if (existing) {
    throw new ExpectedServerActionError(
      "External judge already assigned to this judging slot"
    );
  }

  await prisma.externalTeamJudging.create({
    data: { externalJudgeId, teamId, judgingSlotId },
  });

  revalidatePath(
    `/dashboard/${judgingSlot.hackathonId}/judging/manage`,
    "page"
  );
  revalidatePath(
    `/dashboard/${judgingSlot.hackathonId}/judging/overview`,
    "page"
  );
};

export default createExternalTeamJudging;
