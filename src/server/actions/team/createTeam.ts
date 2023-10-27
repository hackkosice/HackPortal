"use server";

import { prisma } from "@/services/prisma";
import requireHackerSession from "@/server/services/helpers/requireHackerSession";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";

type CreateTeamInput = {
  name: string;
};
const createTeam = async ({ name }: CreateTeamInput) => {
  const { id: hackerId } = await requireHackerSession();

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
