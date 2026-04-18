"use server";

import { prisma } from "@/services/prisma";
import requireSponsorSession from "@/server/services/helpers/auth/requireSponsorSession";
import { revalidatePath } from "next/cache";

type AddSponsorVerdictInput = {
  sponsorJudgingId: number;
  judgingVerdict: string;
};

const addSponsorVerdict = async ({
  sponsorJudgingId,
  judgingVerdict,
}: AddSponsorVerdictInput) => {
  const sponsor = await requireSponsorSession();

  const sponsorJudging = await prisma.sponsorJudging.findUnique({
    where: { id: sponsorJudgingId },
    select: {
      sponsorId: true,
      judgingSlot: {
        select: { hackathonId: true },
      },
    },
  });

  if (!sponsorJudging) {
    throw new Error("Sponsor judging not found");
  }

  if (sponsorJudging.sponsorId !== sponsor.id) {
    throw new Error("Not authorized to add verdict to this sponsor judging");
  }

  await prisma.sponsorJudging.update({
    where: { id: sponsorJudgingId },
    data: { judgingVerdict },
  });

  revalidatePath(
    `/sponsors/${sponsorJudging.judgingSlot.hackathonId}/judging`,
    "page"
  );
};

export default addSponsorVerdict;
