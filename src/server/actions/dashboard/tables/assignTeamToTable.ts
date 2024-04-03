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

  const table = await prisma.table.findFirst({
    where: {
      code: tableCode,
    },
    select: {
      id: true,
    },
  });

  if (!table) {
    throw new ExpectedServerActionError("Table not found");
  }

  const { members } = await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      tableId: table.id,
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
    throw new ExpectedServerActionError("Team not found");
  }

  revalidatePath(`/dashboard/${members[0].hackathonId}/tables`);
};

export default assignTeamToTable;
