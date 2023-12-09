"use server";

import { prisma } from "@/services/prisma";
import requireTeamOwnerSession from "@/server/services/helpers/auth/requireTeamOwnerSession";
import { revalidatePath } from "next/cache";

const deleteTeam = async () => {
  const { team } = await requireTeamOwnerSession();
  await prisma.team.delete({
    where: {
      id: team.id,
    },
  });

  revalidatePath("/application", "page");
};

export default deleteTeam;
