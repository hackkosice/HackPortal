"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type SetMaxTeamSizeInput = {
  maxTeamSize: number;
  hackathonId: number;
};
const setMaxTeamSize = async ({
  maxTeamSize,
  hackathonId,
}: SetMaxTeamSizeInput) => {
  await requireAdminSession();
  await prisma.hackathon.update({
    where: {
      id: hackathonId,
    },
    data: {
      maxTeamSize,
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/settings`, "page");
  revalidatePath("/application", "page");
};

export default setMaxTeamSize;
