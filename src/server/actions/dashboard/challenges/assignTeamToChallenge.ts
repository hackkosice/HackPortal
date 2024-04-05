"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

type AssignTeamToChallengeInput = {
  challengeId: number;
  teamId: number;
};
const assignTeamToChallenge = async ({
  challengeId,
  teamId,
}: AssignTeamToChallengeInput) => {
  await requireAdminSession();

  const alreadyAssignedChallenges = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
    select: {
      challenges: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!alreadyAssignedChallenges) {
    throw new Error("Team not found");
  }

  const isAlreadyAssigned = alreadyAssignedChallenges.challenges.some(
    (challenge) => challenge.id === challengeId
  );

  if (isAlreadyAssigned) {
    throw new ExpectedServerActionError(
      "Challenge is already assigned to the team"
    );
  }

  const { members } = await prisma.team.update({
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
    select: {
      members: {
        select: {
          hackathonId: true,
        },
      },
    },
  });

  if (members.length === 0) {
    throw new Error("Team has no members");
  }

  revalidatePath(`/dashboard/${members[0].hackathonId}/tables`);
};

export default assignTeamToChallenge;
