"use server";

import { prisma } from "@/services/prisma";
import requireHackerSession from "@/server/services/helpers/requireHackerSession";
import { revalidatePath } from "next/cache";

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
    throw new Error("Team not found");
  }

  if (team.members.length >= 4) {
    throw new Error("Team is full");
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
