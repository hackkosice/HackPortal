"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type CreateNewTableInput = {
  hackathonId: number;
  code: string;
};
const createNewTable = async ({ code, hackathonId }: CreateNewTableInput) => {
  await requireAdminSession();
  await prisma.table.create({
    data: {
      code,
      hackathonId,
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/tables`);
};

export default createNewTable;
