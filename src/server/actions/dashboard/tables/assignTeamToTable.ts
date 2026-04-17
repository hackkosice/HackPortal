"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

type AssignTeamToTableInput = {
  tableCode: string;
  teamId: number;
};
const assignTeamToTable = async ({
  tableCode,
  teamId,
}: AssignTeamToTableInput) => {
  await requireAdminSession();

  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
    },
    select: {
      members: {
        select: {
          hackathonId: true,
        },
      },
    },
  });

  if (!team || team.members.length === 0) {
    throw new ExpectedServerActionError("Team not found");
  }

  const hackathonId = team.members[0].hackathonId;

  const table = await prisma.table.findFirst({
    where: {
      code: tableCode,
      hackathonId,
    },
    select: {
      id: true,
    },
  });

  if (!table) {
    throw new ExpectedServerActionError("Table not found");
  }

  await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      tableId: table.id,
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/tables`);
};

export default assignTeamToTable;
