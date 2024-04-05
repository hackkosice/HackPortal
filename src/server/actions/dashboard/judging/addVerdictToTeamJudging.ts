"use server";

import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { revalidatePath } from "next/cache";

type AddVerdictToTeamJudgingInput = {
  teamJudgingId: number;
  judgingVerdict: string;
};
const addVerdictToTeamJudging = async ({
  teamJudgingId,
  judgingVerdict,
}: AddVerdictToTeamJudgingInput) => {
  const { id } = await requireOrganizerSession();

  const teamJudging = await prisma.teamJudging.findUnique({
    where: {
      id: teamJudgingId,
    },
    select: {
      organizerId: true,
      judgingSlot: {
        select: {
          hackathonId: true,
        },
      },
    },
  });

  if (!teamJudging) {
    throw new Error("Team judging not found");
  }

  if (teamJudging.organizerId !== id) {
    throw new Error("Not authorized to add verdict to this team judging");
  }

  await prisma.teamJudging.update({
    where: {
      id: teamJudgingId,
    },
    data: {
      judgingVerdict,
    },
  });

  revalidatePath(
    `/dashboard/${teamJudging.judgingSlot.hackathonId}/judging`,
    "page"
  );
};

export default addVerdictToTeamJudging;
