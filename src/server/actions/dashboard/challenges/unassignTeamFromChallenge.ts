"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type UnassignTeamFromChallengeInput = {
  teamId: number;
  challengeId: number;
};
const unassignTeamFromChallenge = async ({
  teamId,
  challengeId,
}: UnassignTeamFromChallengeInput) => {
  await requireAdminSession();

  const { members } = await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      challenges: {
        disconnect: {
          id: challengeId,
        },
      },
    },
    select: {
      members: {
        select: {
          hackathonId: true,
        },
      },
    },
  });

  if (members.length === 0) {
    throw new Error("Team not found");
  }

  revalidatePath(`/dashboard/${members[0].hackathonId}/tables`);
};

export default unassignTeamFromChallenge;
