"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type AssignTeamToChallengeInput = {
  challengeId: number;
  teamId: number;
};
const assignTeamToChallenge = async ({
  challengeId,
  teamId,
}: AssignTeamToChallengeInput) => {
  await requireAdminSession();

  await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      challenges: {
        connect: {
          id: challengeId,
        },
      },
    },
  });

  revalidatePath(`/dashboard/${challengeId}/tables`);
};

export default assignTeamToChallenge;
