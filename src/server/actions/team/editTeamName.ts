"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireTeamOwnerSession from "@/server/services/helpers/auth/requireTeamOwnerSession";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

type EditTeamNameInput = {
  newName: string;
};
const editTeamName = async ({ newName }: EditTeamNameInput) => {
  const { team } = await requireTeamOwnerSession();

  const existingTeam = await prisma.team.findFirst({
    where: {
      name: newName,
    },
  });

  if (existingTeam) {
    throw new ExpectedServerActionError("Team with this name already exists");
  }

  await prisma.team.update({
    where: {
      id: team.id,
    },
    data: {
      name: newName,
    },
  });

  revalidatePath("/application", "page");
};

export default editTeamName;
