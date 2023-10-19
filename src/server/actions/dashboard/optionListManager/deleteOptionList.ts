"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";

export type DeleteOptionListInput = {
  id: number;
};

const deleteOptionList = async ({ id }: DeleteOptionListInput) => {
  try {
    await prisma.optionList.delete({
      where: {
        id: id,
      },
    });
  } catch {
    throw new Error("Error deleting option list");
  }

  revalidatePath("/dashboard/option-lists");
};

export default deleteOptionList;
