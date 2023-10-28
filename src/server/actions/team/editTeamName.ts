"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireTeamOwnerSession from "@/server/services/helpers/requireTeamOwnerSession";

type EditTeamNameInput = {
  newName: string;
};
const editTeamName = async ({ newName }: EditTeamNameInput) => {
  const { team } = await requireTeamOwnerSession();

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
