"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

type CreateSponsorJudgingInput = {
  sponsorId: number;
  teamId: number;
  judgingSlotId: number;
};

const createSponsorJudging = async ({
  sponsorId,
  teamId,
  judgingSlotId,
}: CreateSponsorJudgingInput) => {
  await requireAdminSession();

  const judgingSlot = await prisma.judgingSlot.findUnique({
    where: { id: judgingSlotId },
    select: { hackathonId: true },
  });

  if (!judgingSlot) {
    throw new Error("Judging slot not found");
  }

  const existingForSlot = await prisma.sponsorJudging.findFirst({
    where: { sponsorId, judgingSlotId },
    select: { id: true },
  });

  if (existingForSlot) {
    throw new ExpectedServerActionError(
      "Sponsor already assigned to a team in this judging slot"
    );
  }

  const existingForTeam = await prisma.sponsorJudging.findFirst({
    where: { sponsorId, teamId },
    select: { id: true },
  });

  if (existingForTeam) {
    throw new ExpectedServerActionError(
      "Sponsor is already assigned to judge this team"
    );
  }

  await prisma.sponsorJudging.create({
    data: { sponsorId, teamId, judgingSlotId },
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

export default createSponsorJudging;
