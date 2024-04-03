"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type UnassignTableFromTeamInput = {
  teamId: number;
};
const unassignTableFromTeam = async ({
  teamId,
}: UnassignTableFromTeamInput) => {
  await requireAdminSession();

  const { members } = await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      tableId: null,
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

export default unassignTableFromTeam;
