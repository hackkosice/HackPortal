"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";

export type CreateNewOptionListInput = {
  name: string;
};

const createNewOptionList = async ({ name }: CreateNewOptionListInput) => {
  await requireAdminSession();
  await prisma.optionList.create({
    data: {
      name: name,
    },
  });

  revalidatePath("/option-lists", "page");
};

export default createNewOptionList;
