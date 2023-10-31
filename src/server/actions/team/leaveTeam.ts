"use server";

import { prisma } from "@/services/prisma";
import requireHackerSession from "@/server/services/helpers/auth/requireHackerSession";
import { revalidatePath } from "next/cache";

const leaveTeam = async () => {
  const hacker = await requireHackerSession();

  if (!hacker.teamId) {
    throw new Error("Hacker is not in a team");
  }

  const teamId = hacker.teamId;

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
    select: {
      id: true,
      ownerId: true,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  if (team.ownerId === hacker.id) {
    throw new Error("Owner cannot leave team");
  }

  await prisma.hacker.update({
    where: {
      id: hacker.id,
    },
    data: {
      teamId: null,
    },
  });

  revalidatePath("/application", "page");
};

export default leaveTeam;
