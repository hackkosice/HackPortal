"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";

export type DeleteOptionListInput = {
  id: number;
};

const deleteOptionList = async ({ id }: DeleteOptionListInput) => {
  await requireAdminSession();
  try {
    await prisma.optionList.delete({
      where: {
        id: id,
      },
    });
  } catch {
    throw new Error("Error deleting option list");
  }

  revalidatePath("/option-lists", "page");
};

export default deleteOptionList;
