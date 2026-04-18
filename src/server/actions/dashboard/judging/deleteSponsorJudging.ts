"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type DeleteSponsorJudgingInput = {
  sponsorJudgingId: number;
};

const deleteSponsorJudging = async ({
  sponsorJudgingId,
}: DeleteSponsorJudgingInput) => {
  await requireAdminSession();

  const {
    judgingSlot: { hackathonId },
  } = await prisma.sponsorJudging.delete({
    where: { id: sponsorJudgingId },
    select: {
      judgingSlot: {
        select: { hackathonId: true },
      },
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/judging/manage`, "page");
  revalidatePath(`/dashboard/${hackathonId}/judging/overview`, "page");
};

export default deleteSponsorJudging;
