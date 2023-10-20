"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";

export type CreateNewOptionListInput = {
  name: string;
};

const createNewOptionList = async ({ name }: CreateNewOptionListInput) => {
  await prisma.optionList.create({
    data: {
      name: name,
    },
  });

  revalidatePath("/dashboard/option-lists", "page");
};

export default createNewOptionList;
