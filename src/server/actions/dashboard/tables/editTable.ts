"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type EditTableInput = {
  tableId: number;
  code: string;
};
const editTable = async ({ tableId, code }: EditTableInput) => {
  await requireAdminSession();

  const { hackathonId } = await prisma.table.update({
    where: {
      id: tableId,
    },
    data: {
      code,
    },
    select: {
      hackathonId: true,
    },
  });
  revalidatePath(`/dashboard/${hackathonId}/tables`);
};

export default editTable;
