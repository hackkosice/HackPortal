"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type DeleteExternalTeamJudgingInput = {
  externalTeamJudgingId: number;
};

const deleteExternalTeamJudging = async ({
  externalTeamJudgingId,
}: DeleteExternalTeamJudgingInput) => {
  await requireAdminSession();

  const record = await prisma.externalTeamJudging.delete({
    where: { id: externalTeamJudgingId },
    select: {
      judgingSlot: { select: { hackathonId: true } },
    },
  });

  revalidatePath(
    `/dashboard/${record.judgingSlot.hackathonId}/judging/manage`,
    "page"
  );
  revalidatePath(
    `/dashboard/${record.judgingSlot.hackathonId}/judging/overview`,
    "page"
  );
};

export default deleteExternalTeamJudging;
