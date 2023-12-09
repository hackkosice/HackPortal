"use server";

import { prisma } from "@/services/prisma";
import requireHackerSession from "@/server/services/helpers/auth/requireHackerSession";
import { revalidatePath } from "next/cache";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

type JoinTeamInput = {
  code: string;
};
const joinTeam = async ({ code }: JoinTeamInput) => {
  const hacker = await requireHackerSession();

  if (hacker.teamId) {
    throw new Error("Hacker already has a team");
  }

  const team = await prisma.team.findUnique({
    where: {
      code,
    },
    select: {
      id: true,
      members: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!team) {
    throw new ExpectedServerActionError("Team not found");
  }

  if (team.members.length >= 4) {
    throw new ExpectedServerActionError("Team is full");
  }

  await prisma.hacker.update({
    where: {
      id: hacker.id,
    },
    data: {
      teamId: team.id,
    },
  });

  revalidatePath("/application", "page");
};

export default joinTeam;
