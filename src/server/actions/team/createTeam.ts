"use server";

import { prisma } from "@/services/prisma";
import requireHackerSession from "@/server/services/helpers/auth/requireHackerSession";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

type CreateTeamInput = {
  name: string;
};
const createTeam = async ({ name }: CreateTeamInput) => {
  if (name.length > 20) {
    throw new ExpectedServerActionError("Team name too long");
  }

  const { id: hackerId } = await requireHackerSession();

  const existingTeam = await prisma.team.findFirst({
    where: {
      name,
    },
  });

  if (existingTeam) {
    throw new ExpectedServerActionError("Team with this name already exists");
  }

  const code = randomBytes(6).toString("hex"); // random string with length 12
  const { id: newTeamId } = await prisma.team.create({
    data: {
      name,
      code,
      ownerId: hackerId,
    },
    select: {
      id: true,
    },
  });
  await prisma.hacker.update({
    where: {
      id: hackerId,
    },
    data: {
      teamId: newTeamId,
    },
  });

  revalidatePath("/application", "page");
};

export default createTeam;
