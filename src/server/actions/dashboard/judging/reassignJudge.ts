"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

type ReassignJudgeInput = {
  teamJudgingId: number;
  newOrganizerId: number;
};

const reassignJudge = async ({
  teamJudgingId,
  newOrganizerId,
}: ReassignJudgeInput) => {
  await requireAdminSession();

  const teamJudging = await prisma.teamJudging.findUnique({
    where: { id: teamJudgingId },
    select: {
      judgingSlotId: true,
      judgingSlot: { select: { hackathonId: true } },
    },
  });

  if (!teamJudging) {
    throw new ExpectedServerActionError("Assignment not found");
  }

  const conflict = await prisma.teamJudging.findFirst({
    where: {
      organizerId: newOrganizerId,
      judgingSlotId: teamJudging.judgingSlotId,
    },
  });

  if (conflict) {
    throw new ExpectedServerActionError(
      "This judge already has a team assigned in this slot"
    );
  }

  await prisma.teamJudging.update({
    where: { id: teamJudgingId },
    data: { organizerId: newOrganizerId, judgingVerdict: null },
  });

  revalidatePath(
    `/dashboard/${teamJudging.judgingSlot.hackathonId}/judging/overview`,
    "page"
  );
  revalidatePath(
    `/dashboard/${teamJudging.judgingSlot.hackathonId}/judging/manage`,
    "page"
  );
};

export default reassignJudge;
